import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, PencilLine } from "lucide-react";
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

  const [isLoarding, setIsLoarding] = useState(false);
  const [error, setError]: any = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const handleUpateProfile = () => {
    const UpdateProfile = async () => {
      setIsLoarding(true);
      const profile: any = await updateService(data);

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
      const data: any = await getServiceById(id);

      if (data?.error) {
        setError(data.error);
        return;
      }
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
    <Dialog
      open={Boolean(id)}
      onOpenChange={(open) => {
        if (!open) setUserId(null);
      }}
    >
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={"flex gap-2 items-center"}>
              {" "}
              <Button variant={"secondary"}>
                <PencilLine />
              </Button>
              Modification du service
            </DialogTitle>
            <DialogDescription>
              Modifie les champs puis enregistre.
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
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              type="submit"
              onClick={handleUpateProfile}
              disabled={isLoarding}
            >
              {isLoarding ? (
                <Loader className="animate-spin" />
              ) : (
                <span>Enregistrer</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
