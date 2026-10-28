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
import { createProfile } from "./equipe.db";

export default function AddProfiles({ makeMute, mute }: any) {
  const [open, setOpen] = useState(false);
  const [isLoarding, setIsLoarding] = useState(false);
  const [error, setError]: any = useState(null);
  const [data, setData] = useState({
    user_mail: "",
    full_name: "",
    email: "",
    phone: "",
    post: "",
    description: "",
    password: "",
  });

  const handleCreateProfile = () => {
    const creatProfile = async () => {
      setIsLoarding(true);
      const profile = await createProfile(data);

      if (profile?.error) {
        setError(profile?.error);
      } else {

        setOpen(false);
        makeMute(!mute)
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
              Ajout d'utilisateur
            </DialogTitle>
            <DialogDescription>
              Remplis les champs pour enregistrer l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="identifiant-1">Identifiant</Label>
              <Input
                id="identifiant-1"
                name="identifiant"
                placeholder="fanta@trabad"
                required
                value={data?.user_mail}
                onChange={(val: any) => {
                  let value = val.target.value?.toLowerCase() || "";
                  value = value.replace(/[^a-z]/g, "");
                  console.log(val);
                  setData({
                    ...data,
                    user_mail: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="nom-1">Mot de pass</Label>
              <Input
                id="password-1"
                name="password"
                required
                value={data?.password}
                type="password"
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    password: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="nom-1">Nom</Label>
              <Input
                id="nom-1"
                name="nom"
                required
                placeholder="Fanta Ouattara"
                value={data?.full_name}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    full_name: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="post-1">Poste</Label>
              <Input
                id="post-1"
                name="post"
                placeholder="assistante"
                required
                value={data?.post}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    post: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="email-1">E-mail</Label>
              <Input
                required
                id="email-1"
                name="email"
                type="email"
                placeholder="fanta@trabad.com"
                value={data?.email}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    email: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="phone-1">Telephone</Label>
              <Input
                required
                id="phone-1"
                name="phone"
                type="tel"
                value={data?.phone}
                onChange={(val: any) => {
                  const value = val.target.value;
                  setData({
                    ...data,
                    phone: value,
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
