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
      const data = await getOrgaServices();

      console.log(data);

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
                console.log(el);

                return (
                  <TableRow>
                    <TableCell>{el?.name}</TableCell>
                    <TableCell>{el?.description}</TableCell>
                    <TableCell>{"4"}</TableCell>

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
                              setServiceId(el.id);
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
                                await deleteService(el.id);
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
