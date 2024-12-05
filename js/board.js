// Array für die Aufgaben
let todos = [];

// Funktion zum Laden der Aufgaben aus Firebase
async function loadTasksFromFirebase() {
  try {
      const response = await fetch(
          "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
      );
      const data = await response.json();

      if (data) {
          todos = Object.keys(data).map((key) => {
              return { id: key, ...data[key] };
          });
          console.log("Aufgaben erfolgreich geladen:", todos);
          updateHTML(); // HTML nach dem Laden der Aufgaben aktualisieren
      } else {
          console.error("Keine Aufgaben gefunden.");
      }
  } catch (error) {
      console.error("Fehler beim Laden der Aufgaben:", error);
  }
}


// Funktion zum Aktualisieren des HTML-Inhalts
function updateHTML() {
  const categories = {
    "1": "open",  // Mapping der Kategorien zur Anzeige
    "2": "inprogress",
    "3": "awaitfeedback",
    "4": "done",
  };

  // Jede Kategorie durchgehen und Spalte aktualisieren
  Object.keys(categories).forEach((categoryKey) => {
    const category = categories[categoryKey];  // Hole den Spaltennamen (z. B. "open")
    const column = document.getElementById(`${category}Column`);
    
    if (column) {
      column.innerHTML = ""; // Spalte leeren

      todos
        .filter((task) => task.category == categoryKey)  // Vergleiche mit der richtigen Kategorie
        .forEach((task) => {
          const taskCard = document.createElement("div");
          taskCard.classList.add("task-card");
          taskCard.setAttribute("id", `task-${task.id}`);
          taskCard.setAttribute("draggable", "true");
          taskCard.setAttribute("ondragstart", "dragStart(event)");  // Funktionsaufruf zum Starten
          taskCard.setAttribute("ondragend", "dragEnd(event)");  // Funktionsaufruf zum Beenden
          taskCard.innerHTML = `
            <h4>${task.title}</h4>
            <p>Priorität: ${task.prio}</p>
            <p>Fällig: ${task.date}</p>
          `;
          column.appendChild(taskCard);
        });
    }
  });
}


// Drag-and-Drop-Events

// Erlaubt das Ablegen von Elementen in der Spalte
function allowDrop(event) {
  event.preventDefault(); // Standardverhalten des Browsers verhindern
  const column = event.target;

  // Überprüfe, ob es sich um eine Spalte handelt, in die abgelegt werden kann
  if (column.classList.contains("drag-area")) {
    column.classList.add("drag-area-highlight"); // Füge die Highlight-Klasse hinzu
  }
}

// Wenn ein Element gezogen wird, speichern wir die ID
function dragStart(event) {
  console.log("Drag gestartet für Element: " + event.target.id);
  event.dataTransfer.setData("text", event.target.id); // Speichern der ID des Elements
}

// Drag-Ende Event (kann genutzt werden, um Styling zurückzusetzen)
function dragEnd(event) {
  console.log(`Drag beendet für Element: ${event.target.id}`);
  event.target.style.opacity = ""; // Optionales Styling zurücksetzen
  event.target.classList.remove("drag-area-highlight");  // Entferne das Highlight
}

// Verschieben der Aufgabe in eine neue Kategorie
async function moveTo(status, event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const card = document.getElementById(data);
  const taskId = data.replace("task-", "");  // Stelle sicher, dass die ID korrekt extrahiert wird
  const task = todos.find(t => t.id === taskId); // Suche die Aufgabe im todos Array

  if (task) {
    const categoryMapping = {
      "open": "1",
      "inprogress": "2",
      "awaitfeedback": "3",
      "done": "4",
    };

    task.category = categoryMapping[status]; // Neue Kategorie setzen

    try {
      // Aufgabe in Firebase aktualisieren
      await fetch(`https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task/${taskId}.json`, {
        method: "PATCH",
        body: JSON.stringify({ category: task.category }),
      });

      console.log(`Aufgabe ${taskId} erfolgreich aktualisiert.`);
      updateHTML(); // HTML nach dem Verschieben aktualisieren

      // Verschiebe die Karte in die neue Spalte im DOM
      const newColumn = document.getElementById(`${status}Column`);
      if (newColumn) {
        newColumn.appendChild(card);  // Füge das Element in die neue Spalte hinzu
      }

    } catch (error) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    }
  }
}


function highlightColumn(status, event) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.add("drag-area-highlight");  // Füge die Highlight-Klasse hinzu
  }
}


function removeHighlight(status) {
  const column = document.getElementById(`${status}Column`);
  if (column) {
    column.classList.remove("drag-area-highlight");  // Entferne die Highlight-Klasse
  }
}


// Seite initialisieren
window.onload = () => {
  includeHTML();
  addTaskTemplate();
  loadTasksFromFirebase(); // Lädt die Aufgaben und ruft anschließend updateHTML auf
};
