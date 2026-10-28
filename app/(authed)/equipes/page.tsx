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
      const data = await getcurrentUsers();

      // console.log(data)

      if (!data?.error) setDataErorMessage(data?.error?.message);
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
          <CardDescription>Liste de tous les utilisteurs</CardDescription>
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
                <TableHead>Telephone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((el: any) => {
                console.log(el);

                return (
                  <TableRow>
                    <TableCell>{el?.identifiant}</TableCell>
                    <TableCell>{el?.full_name}</TableCell>
                    <TableCell>{el?.post}</TableCell>
                    <TableCell>{el?.phone}</TableCell>
                    <TableCell>{el?.email}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              console.log(el.id);
                              setUserId(el.id);
                            }}
                          >
                            {" "}
                            <PencilLine /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              const Delete = async () => {
                                await deleteUser(el.id);
                                makeMute(!mute);
                              };
                              Delete();
                            }}
                          >
                            <Trash /> Delete
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
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
