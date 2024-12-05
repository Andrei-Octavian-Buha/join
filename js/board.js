// Funktion zum Laden der Aufgaben aus Firebase und Aktualisieren des HTML
async function loadTasksFromFirebase() {
  try {
      const response = await fetch(
          "https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task.json"
      );

      if (!response.ok) {
          throw new Error("Netzwerkantwort war nicht ok");
      }

      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
          updateHTML(data); // HTML direkt mit den geladenen Daten aktualisieren
          console.log("Aufgaben erfolgreich geladen.");
      } else {
          console.warn("Keine Aufgaben gefunden.");
      }
  } catch (error) {
      console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

// HTML aktualisieren, basierend auf den Daten aus Firebase
function updateHTML(data) {
  if (!data || Object.keys(data).length === 0) {
      console.warn("Keine Aufgaben gefunden oder Daten sind leer.");
      return;
  }

  const categories = ['todoColumn', 'inprogressColumn', 'awaitfeedbackColumn', 'doneColumn'];

  categories.forEach(category => {
      const container = document.getElementById(category);

      if (container) {
          container.innerHTML = ''; // Vorhandene Inhalte löschen

          Object.keys(data).forEach(key => {
              const task = data[key];

              // Verhindert das Hinzufügen von Aufgaben, wenn der progresswert nicht übereinstimmt
              if (task.progress && task.progress.toLowerCase() === category.replace('Column', '').toLowerCase()) {
                  container.innerHTML += generateTodoHTML({ id: key, ...task });
              }
          });
      }
  });
}


let currentDraggedElement; // Referenz des aktuell gezogenen Elements

// Drag-Start: Speichern der gezogenen Karte
function dragStart(event, id) {
  currentDraggedElement = document.querySelector(`#${id}`);
  event.dataTransfer.setData('text', id);
  event.target.style.opacity = "0.5";
}

// Drag-End: Setzen der Sichtbarkeit zurück
function dragEnd(event) {
  event.target.style.opacity = "1";
}

// Ermöglicht das Ablegen von Aufgaben
function allowDrop(event) {
  event.preventDefault();
}

// Aufgaben in eine andere Kategorie verschieben
async function moveTo(category, event) {
  event.preventDefault();
  if (!currentDraggedElement) return;

  const targetColumn = document.getElementById(category);
  if (!targetColumn) {
      console.error("Ungültige Zielspalte:", category);
      return;
  }

  targetColumn.appendChild(currentDraggedElement);

  const taskId = currentDraggedElement.id;

  const progressMapping = {
      todoColumn: "todo",
      inprogressColumn: "inprogress",
      awaitfeedbackColumn: "awaitfeedback",
      doneColumn: "done",
  };

  const newProgress = progressMapping[category];
  if (!newProgress) {
      console.error("Ungültige Kategorie:", category);
      return;
  }

  // Bestehende Daten der Aufgabe abrufen
  const existingTaskData = await getTaskData(taskId);

  // Progress in der Firebase-Datenbank aktualisieren
  if (existingTaskData) {
      await updateTaskProgressInFirebase(taskId, newProgress, existingTaskData);
      console.log(`Task ${taskId} erfolgreich in Kategorie ${newProgress} verschoben.`);
  }
}

// Funktion zum Abrufen bestehender Daten einer Aufgabe
async function getTaskData(taskId) {
  try {
      const response = await fetch(
          `https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task/${taskId}.json`
      );
      if (response.ok) {
          return await response.json();
      } else {
          console.error("Fehler beim Abrufen der bestehenden Daten.");
          return null;
      }
  } catch (error) {
      console.error("Fehler beim Abrufen der Aufgabe:", error);
      return null;
  }
}

// Funktion zum Aktualisieren des Progress in Firebase
async function updateTaskProgressInFirebase(taskId, newProgress, existingTaskData) {
  try {
      const updatedTaskData = {
          ...existingTaskData,
          progress: newProgress,
      };

      const response = await fetch(
          `https://join-store-ae38e-default-rtdb.europe-west1.firebasedatabase.app/task/${taskId}.json`,
          {
              method: 'PUT', // Ändere PATCH zu PUT
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedTaskData),
          }
      );

      if (response.ok) {
          console.log(`Progress der Aufgabe ${taskId} erfolgreich auf ${newProgress} aktualisiert.`);
      } else {
          console.error("Fehler beim Aktualisieren des Progress in Firebase.");
      }
  } catch (error) {
      console.error("Fehler beim Firebase-Update:", error);
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

async function loadTasksForSorting() {
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
      
      // Aufgaben zählen und in sessionStorage speichern
      countTasksByCategory();

      updateHTML(); // HTML nach dem Laden der Aufgaben aktualisieren
    } else {
      console.error("Keine Aufgaben gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Aufgaben:", error);
  }
}

function countTasksByCategory() {
  const counts = {
    todo: 0,
    inprogress: 0,
    awaitfeedback: 0,
    done: 0,
    urgent: 0,
    total: 0, // Add a field for total count
  };

  todos.forEach((task) => {
    counts.total++; // Increment total for each task

    // Count based on categories
    if (task.category === "1") counts.todo++;
    if (task.category === "2") counts.inprogress++;
    if (task.category === "3") counts.awaitfeedback++;
    if (task.category === "4") counts.done++;
    if (task.prio === "urgent") counts.urgent++;
  });

  // Store the counts in sessionStorage
  sessionStorage.setItem("taskCounts", JSON.stringify(counts));
}

