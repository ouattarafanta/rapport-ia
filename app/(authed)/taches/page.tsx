"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { useEffect, useState } from "react";
import {
  Check,
  Loader,
  Plus,
  SquarePen,
  TextAlignStart,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import {
  createTask,
  deleteTask,
  getTasks,
  makeTasksDone,
  updateTask,
  updateTaskWitheUndo,
} from "./taches.db";


const Taches = () => {
  const [useData, setData]: any = useState([]);
  const [inputText, setInputText]: any = useState("");
  const [taskContent, setTaskContent]: any = useState("");
  const [isLoarding, setIsLoarding]: any = useState(false);
  const [mute, makeMute]: any = useState(false);
  const [currentTask, setCurrentTask]: any = useState({});

  // chargement de la liste au premier affichage
  const [isListLoading, setIsListLoading] = useState(true);
  // filtre : "toutes", "en_cours" ou "terminees"
  const [filtre, setFiltre] = useState("toutes");
  // id de la tâche en cours d'enregistrement (évite les doubles clics)
  const [savingId, setSavingId]: any = useState(null);


  const handleCreateTask = async () => {
    if (!inputText.trim() || isLoarding) return;
    setIsLoarding(true);
    const result: any = await createTask({ title: inputText, content: taskContent });
    setIsLoarding(false);

    if (result?.error) {
      alert(result.error.message);
      return;
    }
    setInputText("");
    setTaskContent("");


    makeMute(!mute);
  };


  const handleUpdateTask = async () => {
    if (!currentTask?.title?.trim()) {
      alert("Le titre ne peut pas être vide.");
      return;
    }
    setSavingId(currentTask.id);
    await updateTask(currentTask.id, currentTask);
    setSavingId(null);
    makeMute(!mute);
    setCurrentTask({});
  };

  const handleTaskDone = async (id: string) => {
    setSavingId(id);
    await makeTasksDone(id);
    setSavingId(null);
    makeMute(!mute);
  };

  // compteurs et filtre
  const nbEnCours = useData.filter((el: any) => !el.is_finished).length;
  const nbTerminees = useData.filter((el: any) => el.is_finished).length;

  const tachesAffichees = useData.filter((el: any) => {
    if (filtre == "en_cours") return !el.is_finished;
    if (filtre == "terminees") return el.is_finished;
    return true;
  });

  const filtres = [
    { label: "Toutes", value: "toutes", nombre: useData.length },
    { label: "En cours", value: "en_cours", nombre: nbEnCours },
    { label: "Terminées", value: "terminees", nombre: nbTerminees },
  ];

  useEffect(() => {
    const GetUser = async () => {
      const data: any = await getTasks();
      setData(Array.isArray(data) ? data : []);
      setIsListLoading(false);
    };
    GetUser();
  }, [mute]);


  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Créer une tâche
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez une nouvelle tâche à votre espace de travail.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Ex. : Préparer le rapport mensuel"
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value);
            }}
            onKeyDown={(event) => {
              // Entrée = créer la tâche
              if (event.key === "Enter") handleCreateTask();
            }}
            className="h-11 flex-1"
          />


          <Button
            disabled={!inputText.trim() || isLoarding}
            className="h-11 gap-2 px-5"
            onClick={handleCreateTask}
          >
            {isLoarding ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Créer une tâche
          </Button>
        </div>


        {inputText && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description de la tâche
            </label>


            <textarea
              id="task-description"
              placeholder="Décrivez les détails de cette tâche..."
              className="min-h-32 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              value={taskContent}
              onChange={(event) => {
                setTaskContent(event.target.value);
              }}
            />


            <p className="text-xs text-muted-foreground">
              Ajoutez les informations nécessaires pour réaliser cette tâche.
            </p>
          </div>
        )}
      </div>


      <div className="mt-4 flex flex-wrap gap-2 mx-1">
        {filtres.map((item) => (
          <Button
            key={item.value}
            variant={filtre == item.value ? "default" : "outline"}
            onClick={() => setFiltre(item.value)}
          >
            {item.label} ({item.nombre})
          </Button>
        ))}
      </div>

      <div className="mt-4">
        {isListLoading && (
          <p className="flex items-center gap-2 text-muted-foreground m-3">
            <Loader className="animate-spin" /> Chargement des tâches...
          </p>
        )}

        {!isListLoading && tachesAffichees.length == 0 && (
          <p className="text-muted-foreground m-3">
            {useData.length == 0
              ? "Aucune tâche pour le moment. Créez votre première tâche ci-dessus."
              : "Aucune tâche dans cette catégorie."}
          </p>
        )}

        {tachesAffichees.map((el: any) => {
          if (el.id == currentTask.id) {
            return (
              <div
                key={el.id}
                className="m-3 flex flex-col gap-2 bg-secondary p-3 rounded-lg"
              >
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder=""
                    value={currentTask.title}
                    className="bg-white"
                    autoFocus
                    onChange={(e) => {
                      setCurrentTask({ ...currentTask, title: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      // Entrée = enregistrer, Échap = annuler
                      if (e.key === "Enter") handleUpdateTask();
                      if (e.key === "Escape") setCurrentTask({});
                    }}
                  />


                  {currentTask?.is_finished && (
                    <Button
                      className="h-11 gap-2 px-5"
                      variant={"outline"}
                      onClick={async () => {
                        await updateTaskWitheUndo(currentTask.id, currentTask);
                        makeMute(!mute);
                        setCurrentTask({});
                      }}
                    >
                      <Undo2 />
                      Non terminer
                    </Button>
                  )}


                  <Button
                    className="h-11 gap-2 px-5"
                    variant={"destructive"}
                    onClick={() => {
                      setCurrentTask({});
                    }}
                  >
                    <X/>
                    Annuler
                  </Button>
                </div>


                <textarea
                  id="task-description"
                  placeholder="Décrivez les détails de cette tâche..."
                  className="min-h-32 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                  value={currentTask?.content || ""}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setCurrentTask({});
                  }}
                  onChange={(e) => {
                    setCurrentTask({
                      ...currentTask,
                      content: e.target.value,
                    });
                  }}
                />


                <div className="flex gap-2">
                  <Button
                    className="h-11 gap-2 px-5 flex-1"
                    variant={"default"}
                    disabled={savingId == currentTask.id}
                    onClick={handleUpdateTask}
                  >
                    {savingId == currentTask.id ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Check />
                    )}
                    Enregistrer la modification
                  </Button>
                  <Button
                    className="h-11 gap-2 px-5"
                    variant={"destructive"}
                    onClick={async () => {
                      // confirmation avant de supprimer
                      if (!confirm("Supprimer cette tâche ?")) return;
                      await deleteTask(currentTask.id);
                      makeMute(!mute);
                      setCurrentTask({});
                    }}
                  >
                    <Trash />
                    Supprimer la tache
                  </Button>
                </div>
              </div>
            );
          }


          return (
            <div key={el.id}>
              <Accordion className={"mt-0 mx-1"}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex gap-2 items-center">
                    {el?.content && <TextAlignStart />}

                    <Input
                      placeholder=""
                      value={el?.title}
                      readOnly={true}
                      title="Double-cliquez pour modifier"
                      onDoubleClick={() => {
                        setCurrentTask(el);
                      }}
                      className={
                        "border-none shadow-none outline-none ring-0 hover:outline-none focus:outline-none focus-visible:ring-0" +
                        (el?.is_finished ? " line-through text-muted-foreground" : "")
                      }
                    />


                    {el?.is_finished ? (
                      <Button className="h-11 gap-2 px-5" disabled={true}>
                        <Check />
                        Terminée
                      </Button>
                    ) : (

                      <Button
                        className="h-11 gap-2 px-5"
                        disabled={savingId == el.id}
                        onClick={(event) => {
                          // évite d'ouvrir l'accordéon en cliquant sur le bouton
                          event.stopPropagation();
                          handleTaskDone(el.id);
                        }}
                      >
                        {savingId == el.id ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Check />
                        )}
                        Terminer
                      </Button>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="bg-secondary p-2 rounded-md whitespace-pre-line">
                      {el?.content || "Aucune description."}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        Créée le{" "}
                        {new Date(el.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {el?.meta_data?.finished_at &&
                          " · Terminée le " +
                            new Date(el.meta_data.finished_at).toLocaleDateString(
                              "fr-FR",
                              { day: "numeric", month: "long", year: "numeric" },
                            )}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentTask(el);
                        }}
                      >
                        <SquarePen /> Modifier
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Taches;
