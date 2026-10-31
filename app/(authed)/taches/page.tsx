"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { getcurrentUser } from "@/app/auth/auth.db";
import { createClientSide } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  SquarePen,
  TextAlignStart,
  Trash,
  Undo2,
  UserRound,
  UserRoundPen,
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
  const [isreadOnly, setisreadOnly]: any = useState(true);
  const [isLoarding, setIsLoarding]: any = useState(false);
  const [mute, makeMute]: any = useState(false);
  const [currentTask, setCurrentTask]: any = useState({});


  const [fullname, setfullname]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [phone, setPhone]: any = useState("");
  const [post, setPost]: any = useState("");


  const supabase = createClientSide();


  const handleCreateTask = async () => {
    setIsLoarding(true);
    await createTask({ title: inputText, content: taskContent });
    setIsLoarding(false);
    setInputText("");
    setTaskContent("");


    makeMute(!mute);
  };


  useEffect(() => {
    const GetUser = async () => {
      const data = await getTasks();
      setData(data);
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
            className="h-11 flex-1"
          />


          <Button
            disabled={!inputText.trim() || isLoarding}
            className="h-11 gap-2 px-5"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4"/>
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


      <div className="mt-4">
        {useData?.map((el: any) => {
          if (el.id == currentTask.id) {
            return (
              <div className="m-3 flex flex-col gap-2 bg-secondary p-3 rounded-lg">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder=""
                    value={currentTask.title}
                    className="bg-white"
                    onChange={(e) => {
                      setCurrentTask({ ...currentTask, title: e.target.value });
                    }}
                  />


                  {currentTask?.is_finished && (
                    <Button
                      className="h-11 gap-2 px-5"
                      variant={"outline"}
                      onClick={() => {
                        updateTaskWitheUndo(currentTask.id, currentTask);
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
                  value={currentTask?.content}
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
                    onClick={() => {
                      updateTask(currentTask.id, currentTask);
                      makeMute(!mute);
                      setCurrentTask({});
                    }}
                  >
                    <Check />
                    Enregistrer la modification
                  </Button>
                  <Button
                    className="h-11 gap-2 px-5"
                    variant={"destructive"}
                    onClick={() => {
                      deleteTask(currentTask.id);
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
            <div className="">
              <Accordion className={"mt-0 mx-1"}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex gap-2 items-center">
                    {el?.content && <TextAlignStart />}

                    <Input
                      placeholder=""
                      value={el?.title}
                      readOnly={true}
                      onDoubleClick={() => {
                        setCurrentTask(el);
                      }}
                      className="border-none shadow-none outline-none ring-0 hover:outline-none focus:outline-none focus-visible:ring-0"
                      // className=" hover:outline-none no-underline "
                    />


                    {el?.is_finished ? (
                      <Button className="h-11 gap-2 px-5" disabled={true}>
                        <Check />
                        Terminer
                      </Button>
                    ) : (

                      <Button
                        className="h-11 gap-2 px-5"
                        onClick={() => {
                          makeTasksDone(el.id);
                          makeMute(!mute);
                        }}
                      >
                        <Check />
                        Terminer
                      </Button>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="bg-secondary p-2 rounded-md">{el?.content}</p>
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
