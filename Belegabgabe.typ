#import "@preview/vienna-tech:1.0.0": *
#import "@preview/wordometer:0.1.4": word-count, total-words

#show "Typst": fancy-typst
#show "LaTeX": fancy-latex

#show: tuw-thesis.with(
  header-title: "Medizinische Informationssysteme - Therapieadhäsion",
)

#maketitle(
  title: [Ein Medizinisches Informationssystem zur Unterstützung der Therapieadhäsion],  
  thesis-type: [Mensch Maschine Interaktion],
  authors: (
    (
      name:"Marlon Kaasche",
      email: "marlon.kaasche@student.htw-berlin.de",
      matrnr: "s0593402",
    ),
    (
      name:"DavidThien Vu David Nguyen",
      email: "Thien.Nguyen@Student.HTW-Berlin.de",
      matrnr: "",
    ),
  ),
)
#pagebreak()

#outline()

#pagebreak()

#include ("Einleitung.typ")
#include "Zieldefinition.typ"
#include "Funktionsbeschreibung.typ"
#include "Technisches_Konzept.typ"
#include "Projektstruktur.typ"
#include "Zeitplan.typ"

#bibliography("assets/Literaturverzeichnis.bib")