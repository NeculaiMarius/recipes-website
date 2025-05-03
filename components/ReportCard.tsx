import { Report } from "@/interfaces/report";
import Link from "next/link";
import { MessageCircleWarning } from "lucide-react";
import React from "react";
import UserHoverCard from "./UserHoverCard";

const ReportCard = ({ report }: { report: Report }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 w-full max-w-xl space-y-4 transition hover:shadow-lg">
      <div className="flex items-center gap-2 text-red-600 font-semibold text-base">
        <MessageCircleWarning className="w-5 h-5" />
        <span>Raport utilizator</span>
      </div>

      <div className="text-sm text-gray-700">
        <span className="font-medium">Raportat de: </span>
        <UserHoverCard
          nume={report.nume}
          prenume={report.prenume}
          id={report.id_utilizator}
          email={report.email}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium">Categorie:</span>
        <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-xs font-medium capitalize">
          {report.categorie}
        </span>
      </div>

      <div className="text-sm text-gray-800">
        <span className="font-medium block mb-1">Detalii:</span>
        <p className="bg-gray-50 rounded-lg p-3 border text-gray-700 whitespace-pre-line">
          {report.detalii}
        </p>
      </div>
    </div>
  );
};

export default ReportCard;
