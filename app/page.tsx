"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreVertical, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/shared/filter-bar";

/**
 * Page de vérification du design system (Phase 1 + Phase 4).
 * Sera remplacée par la landing réelle en Phase 5 (voir eventlink_landing.html
 * pour le contenu déjà validé côté marque).
 */
export default function DesignSystemCheckPage() {
  const [page, setPage] = useState(1);
  const [ville, setVille] = useState<string | undefined>();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium text-el-violet">EventLink</p>
        <h1 className="text-el-gradient text-3xl font-semibold">
          Connexion. Confiance. Événements réussis.
        </h1>
        <p className="text-muted-foreground">
          Socle d&rsquo;architecture — arborescence, conventions et système de
          design. Aucune fonctionnalité métier sur cette page.
        </p>
        <div className="flex gap-3 pt-2">
          <Button asChild variant="primary" size="sm">
            <Link href="/inscription">Créer un compte</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/connexion">Se connecter</Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Boutons, badges, champs</CardTitle>
          <CardDescription>
            Vérification visuelle des tokens de marque.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Publier une demande</Button>
            <Button variant="default">Explorer les prestataires</Button>
            <Button variant="outline">En savoir plus</Button>
            <Button variant="ghost">Annuler</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="trust">Pro vérifié</Badge>
            <Badge variant="default">Sonorisation</Badge>
            <Badge variant="success">Offre acceptée</Badge>
            <Badge variant="warning">En attente</Badge>
            <Badge variant="outline">Mariage</Badge>
          </div>

          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="check-email">Adresse e-mail</Label>
            <Input id="check-email" type="email" placeholder="vous@exemple.com" />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="check-cgu" />
            <Label htmlFor="check-cgu">J&rsquo;accepte les conditions</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Composants Phase 4</CardTitle>
          <CardDescription>
            Dialog, Select, DropdownMenu, Tabs, Table, Pagination, Loader, Avatar,
            Tooltip, notifications toast.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Ouvrir un dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer l&rsquo;action</DialogTitle>
                  <DialogDescription>
                    Ceci est un exemple de contenu de dialog/modal.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Annuler</Button>
                  <Button variant="primary">Confirmer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => toast.success("Notification de test envoyée")}
            >
              Déclencher un toast
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Settings className="size-4" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar>
                  <AvatarFallback>EL</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>Avatar avec initiales</TooltipContent>
            </Tooltip>

            <Loader label="Chargement…" />
          </div>

          <Separator />

          <Tabs defaultValue="apercu">
            <TabsList>
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>
            <TabsContent value="apercu" className="pt-3 text-sm text-muted-foreground">
              Contenu de l&rsquo;onglet Aperçu.
            </TabsContent>
            <TabsContent value="details" className="pt-3 text-sm text-muted-foreground">
              Contenu de l&rsquo;onglet Détails.
            </TabsContent>
          </Tabs>

          <FilterBar
            searchPlaceholder="Rechercher un prestataire…"
            filters={[
              {
                key: "ville",
                label: "Ville",
                value: ville,
                onChange: setVille,
                options: [
                  { value: "abidjan", label: "Abidjan" },
                  { value: "bouake", label: "Bouaké" },
                ],
              },
            ]}
            onReset={() => setVille(undefined)}
          />

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sonorisation">Sonorisation</SelectItem>
              <SelectItem value="dj">DJ</SelectItem>
              <SelectItem value="decoration">Décoration</SelectItem>
            </SelectContent>
          </Select>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Son du Ciel Events</TableCell>
                <TableCell>Sonorisation</TableCell>
                <TableCell>
                  <Badge variant="success">Vérifié</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>DJ Mix Assist</TableCell>
                <TableCell>DJ</TableCell>
                <TableCell>
                  <Badge variant="warning">En attente</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Pagination
            page={page}
            totalPages={5}
            hrefForPage={(p) => `/?page=${p}`}
          />
          <div className="flex justify-center gap-2 text-xs text-muted-foreground">
            (démo locale, page actuelle : {page})
            <button className="underline" onClick={() => setPage((p) => Math.max(1, p - 1))}>
              -1
            </button>
            <button className="underline" onClick={() => setPage((p) => Math.min(5, p + 1))}>
              +1
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
