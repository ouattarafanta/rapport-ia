"use client";

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
import { Sparkles, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { getTasksByPeriodAndAuthor } from "./rapports.db";
import { getPeriodDates } from "@/lib/utils";

export function CreateRapport({ generate }: any) {
  const [currentPeriod, setCurrentPeriod] = useState("week");
  const [currentAuthor, setCurrentAuthor] = useState("individual");

  const [startDate, setStartDate] = useState(getPeriodDates("week").startDate);
  const [endDate, setEndDate] = useState(getPeriodDates("week").endDate);

  const period = [
    { label: "Rapport Journalier", value: "day" },
    { label: "Rapport Hebdomadaire", value: "week" },
    { label: "Rapport Mensuel", value: "month" },
    { label: "Rapport Annuel", value: "year" },
  ];

  const author = [
    { label: "Rapport Individuel", value: "individual" },
    { label: "Rapport de Service", value: "service" },
  ];

  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button className={"w-full"}>
              <Sparkles className="animate-pulse" />
              Generer un rapport
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={"flex gap-2 items-center"}>
              <Sparkles className="animate-pulse" />
              Générer un rapport
            </DialogTitle>
            <DialogDescription>
              Choisissez la période et le type de rapport à créer selon vos
              besoins.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Periode</Label>

              <Select
                items={period}
                value={currentPeriod}
                onValueChange={(value: any) => {
                  setCurrentPeriod(value);

                  const dates = getPeriodDates(value);
                  setStartDate(dates.startDate);
                  setEndDate(dates.endDate);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {period.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={formatDateTimeLocal(startDate)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />

                <Input
                  type="datetime-local"
                  value={formatDateTimeLocal(endDate)}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="name-1">Auteurs</Label>

              <Select
                items={author}
                onValueChange={(e: any) => {
                  setCurrentAuthor(e);
                }}
                defaultValue={"personal"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Auteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {author.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="destructive">
                  {" "}
                  <X />
                  Annuler
                </Button>
              }
            />
            <Button
              type="button"
              onClick={() => {
                generate({
                  period: currentPeriod,
                  author: currentAuthor,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                });
              }}
            >
              <Sparkles className="animate-pulse" />
              Générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

const formatDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
