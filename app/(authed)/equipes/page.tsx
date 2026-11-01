"use client";

import {
  CirclePlus,
  MoreHorizontalIcon,
  PencilLine,
  Trash,
  Users,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddProfiles from "./Add-profiles";
import { useEffect, useState } from "react";
import { deleteUser, getcurrentProfiles, getcurrentUsers } from "./equipe.db";
import EditProfiles from "./Edit-profile";

export default function TableActions() {
  const [data, setData]: any = useState([]);
  const [userId, setUserId]: any = useState(null);
  const [mute, makeMute]: any = useState(false);
  const [dataErorMessage, setDataErorMessage]: any = useState("");

  const init = () => {
    const GetProfiles = async () => {
      const data: any = await getcurrentUsers();

      if (data?.error) {
        setDataErorMessage(data.error.message);
        setData([]);
        return;
      }
      setDataErorMessage("");
      setData(data || []);
    };

    GetProfiles();
  };

  useEffect(() => {
    // setIsLoarding(true);

    init();
    // setIsLoarding(false);
  }, [mute]);
  return (
    <div className="">
      {userId && (
        <EditProfiles
          id={userId}
          setUserId={setUserId}
          makeMute={makeMute}
          mute={mute}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <Users />
            Equipes
          </CardTitle>
          <CardDescription>Liste de tous les utilisateurs</CardDescription>
          <CardAction>
            <AddProfiles makeMute={makeMute} mute={mute} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifiants</TableHead>
                <TableHead>Noms</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((el: any) => {
                return (
                  <TableRow key={el.id}>
                    <TableCell>{el?.identifiant}</TableCell>
                    <TableCell>{el?.full_name}</TableCell>
                    <TableCell>{el?.post}</TableCell>
                    <TableCell>{el?.service_name || "-"}</TableCell>
                    <TableCell>{el?.phone}</TableCell>
                    <TableCell>{el?.email}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            />
                          }
                        >
                          <MoreHorizontalIcon />
                          <span className="sr-only">Ouvrir le menu</span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setUserId(el.id);
                            }}
                          >
                            <PencilLine /> Modifier
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              // confirmation avant de supprimer
                              if (
                                !confirm(
                                  "Supprimer " +
                                    el?.full_name +
                                    " ? Ses tâches seront aussi supprimées.",
                                )
                              ) {
                                return;
                              }
                              const Delete = async () => {
                                const result: any = await deleteUser(el.id);
                                if (result?.error) {
                                  alert(result.error.message);
                                }
                                makeMute(!mute);
                              };
                              Delete();
                            }}
                          >
                            <Trash /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          {dataErorMessage ? (
            <p className="text-red-500">{dataErorMessage}</p>
          ) : (
            <p>{data.length} utilisateur(s)</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
