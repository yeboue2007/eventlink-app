import { Wallet } from "lucide-react";

export function BudgetSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-10 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-el-gradient">
          <Wallet className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Indiquez votre budget
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Donnez une fourchette de budget. Les prestataires restent libres
            de proposer leurs propres tarifs et conditions.
          </p>
        </div>
      </div>
    </section>
  );
}
