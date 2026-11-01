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
import { useEffect, useState } from "react";
import { createProfile } from "./equipe.db";
import { getOrgaServices } from "../services/services.db";

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
    service_id: "",
    password: "",
  });
  const [services, setServices]: any = useState([]);

  // liste des services pour le choix du service
  useEffect(() => {
    const GetServices = async () => {
      const result: any = await getOrgaServices();
      setServices(Array.isArray(result) ? result : []);
    };
    GetServices();
  }, []);

  const handleCreateProfile = () => {
    const creatProfile = async () => {
      setIsLoarding(true);
      const profile = await createProfile(data);

      if (profile?.error) {
        setError(profile?.error);
      } else {
        // on vide le formulaire pour le prochain ajout
        setData({
          user_mail: "",
          full_name: "",
          email: "",
          phone: "",
          post: "",
          service_id: "",
          password: "",
        });
        setError(null);
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
        <DialogTrigger
          render={
            <Button variant="default" size={"lg"} className="font-semibold" />
          }
        >
          <CirclePlus /> Ajouter
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
                  setData({
                    ...data,
                    user_mail: value,
                  });
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="password-1">Mot de passe (8 caractères min.)</Label>
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
              <Label htmlFor="service-1">Service</Label>
              <select
                id="service-1"
                value={data?.service_id}
                onChange={(val: any) => {
                  setData({
                    ...data,
                    service_id: val.target.value,
                  });
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Aucun service</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>

            {error && <p className=" text-red-500"> {error?.message} </p>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              type="submit"
              onClick={handleCreateProfile}
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
