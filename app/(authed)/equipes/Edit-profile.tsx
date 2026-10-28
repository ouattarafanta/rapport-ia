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
import { createProfile, getOrgaUser, updateProfile } from "./equipe.db";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function EditProfiles({ id, setUserId, makeMute, mute }: any) {
  const [dataErorMessage, setDataErorMessage]: any = useState("");

  const [isLoarding, setIsLoarding] = useState(false);
  const [error, setError]: any = useState(null);
  const [data, setData] = useState({
    id: id,
    user_mail: "",
    identifiant: "",
    full_name: "",
    email: "",
    phone: "",
    post: "",
    description: "",
    password: "",
  });

  const handleUpateProfile = () => {
    const UpdateProfile = async () => {
      setIsLoarding(true);
      const profile = await updateProfile(data);

      if (profile?.error) {
        setError(profile?.error);
      } else {
        // setOpen(false);
        makeMute(!mute);
      }
      setIsLoarding(false);
    };

    UpdateProfile();
  };

  const init = () => {
    const GetProfile = async () => {
      const data = await getOrgaUser(id);

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
              <Label htmlFor="identifiant-1">Identifiant</Label>
              <Input
                id="identifiant-1"
                name="identifiant"
                placeholder="fanta@trabad"
                readOnly
                value={data?.identifiant}
                // onChange={(val: any) => {
                //   let value = val.target.value?.toLowerCase() || "";
                //   value = value.replace(/[^a-z]/g, "");
                //   console.log(val);
                //   setData({
                //     ...data,
                //     user_mail: value,
                //   });
                // }}
              />
            </Field>

            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>Modff le pass</AccordionTrigger>
                <AccordionContent className="p-2">
                  <Field>
                    <Label htmlFor="nom-1">Mot de passe</Label>
                    <Input
                      id="password-1"
                      name="password"
                      required
                      value={data?.password}
                      type="password"
                      placeholder="Nouveau mot de passe"
                      onChange={(val: any) => {
                        const value = val.target.value;
                        setData({
                          ...data,
                          password: value,
                        });
                      }}
                    />
                  </Field>{" "}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
