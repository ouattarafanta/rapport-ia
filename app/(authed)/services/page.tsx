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
import AddProfiles from "./Add-service";
import { useEffect, useState } from "react";
import { deleteService, getOrgaServices } from "./services.db";
import EditService from "./Edit-service";

export default function TableActions() {
  const [data, setData]: any = useState([]);
  const [serviceId, setServiceId]: any = useState(null);
  const [mute, makeMute]: any = useState(false);
  const [dataErorMessage, setDataErorMessage]: any = useState("");

  const init = () => {
    const GetProfiles = async () => {
      const data: any = await getOrgaServices();

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
      {serviceId && (
        <EditService
          id={serviceId}
          setUserId={setServiceId}
          makeMute={makeMute}
          mute={mute}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <Users />
            Services
          </CardTitle>
          <CardDescription>Liste de tous les services</CardDescription>
          <CardAction>
            <AddProfiles makeMute={makeMute} mute={mute} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Noms</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Nb collabs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((el: any) => {
                return (
                  <TableRow key={el.id}>
                    <TableCell>{el?.name}</TableCell>
                    <TableCell>{el?.description}</TableCell>
                    <TableCell>{el?.nb_collabs}</TableCell>

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
                              setServiceId(el.id);
                            }}
                          >
                            <PencilLine /> Modifier
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              // confirmation avant de supprimer
                              if (!confirm("Supprimer le service " + el?.name + " ?")) {
                                return;
                              }
                              const Delete = async () => {
                                const result: any = await deleteService(el.id);
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
            <p>{data.length} service(s)</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
