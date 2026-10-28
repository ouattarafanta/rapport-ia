import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Loader, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServiceById, updateService } from "./services.db";

export default function EditService({ id, setUserId, makeMute, mute }: any) {
  const [dataErorMessage, setDataErorMessage]: any = useState("");

  const [isLoarding, setIsLoarding] = useState(false);
  const [error, setError]: any = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const handleUpateProfile = () => {
    const UpdateProfile = async () => {
      setIsLoarding(true);
      const profile = await updateService(data);

      if (profile?.error) {
        setError(profile?.error);
      } else {
        setUserId(false);
        makeMute(!mute);
      }
      setIsLoarding(false);
    };

    UpdateProfile();
  };

  const init = () => {
    const GetProfile = async () => {
      const data = await getServiceById(id);

      console.log(data);

      if (!data?.error) setDataErorMessage(data?.error?.message);
      setData(data || ({} as any));
    };

    GetProfile();
  };

  useEffect(() => {
    // setIsLoarding(true);

    init();
    // setIsLoarding(false);
  }, [mute]);

  if (!id) return;

  return (
    <Dialog open={id} onOpenChange={setUserId}>
      <form>
        <DialogTrigger asChild>
          <div className=""></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={"flex gap-2 items-center"}>
              {" "}
              <Button variant={"secondary"}>
                <CirclePlus />
              </Button>
              Ajout d'utilisateur
            </DialogTitle>
            <DialogDescription>
              Remplis les champs pour enregistrer l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
           
            <Field>
              <Label htmlFor="nom-1">Nom</Label>
              <Input
                id="nom-1"
                name="nom"
                required
                placeholder="Informatique"
                value={data?.name}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    name: value,
                  });
                }}
              />
            </Field>


            <Field>
              <Label htmlFor="desc-1">Description</Label>
              <textarea
                id="desc-1"
                name="desc"
                value={data?.description}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    description: value,
                  });
                }}
              />
            </Field>

            {error && <p className=" text-red-500"> {error?.message} </p>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleUpateProfile}
              disabled={isLoarding}
            >
              {isLoarding ? (
                <Loader className="animate-spin" />
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
