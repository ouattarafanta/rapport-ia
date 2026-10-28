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
import { CirclePlus, Loader } from "lucide-react";
import { useState } from "react";
import { createService } from "./services.db";

export default function AddProfiles({ makeMute, mute }: any) {
  const [open, setOpen] = useState(false);
  const [isLoarding, setIsLoarding] = useState(false);
  const [error, setError]: any = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const handleCreateProfile = () => {
    const creatProfile = async () => {
      setIsLoarding(true);
      const profile = await createService(data);

      if (profile?.error) {
        setError(profile?.error);
      } else {
        setOpen(false);
        makeMute(!mute);
      }
      setIsLoarding(false);
    };

    creatProfile();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default" size={"lg"} className="font-semibold">
            <CirclePlus /> Ajouter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={"flex gap-2 items-center"}>
              {" "}
              <Button variant={"secondary"}>
                <CirclePlus />
              </Button>
              Ajout 
            </DialogTitle>
            <DialogDescription>
              Remplis les champs pour enregistrer .
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
              onClick={handleCreateProfile}
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
