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

        console.log("Geladene Daten:", data); // Daten prüfen

        if (data && Object.keys(data).length > 0) {
            updateHTML(data); // HTML aktualisieren
            console.log("Aufgaben erfolgreich geladen.");
        } else {
            console.warn("Keine Aufgaben gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Aufgaben:", error);
    }
}


function filterTasks() {
    const searchInput = document.querySelector('.searchinput').value.toLowerCase();
    console.log("Suchbegriff:", searchInput);

    // Kategorien durchlaufen
    const categories = ['todoColumn', 'inprogressColumn', 'awaitfeedbackColumn', 'doneColumn'];

    categories.forEach(category => {
        const container = document.getElementById(category);

        if (container) {
            const tasks = container.querySelectorAll('.boardTaskCard'); // Filtert Cards mit der Klasse "boardTaskCard"

            tasks.forEach(task => {
                const taskTitle = task.querySelector('.boardCardTitle')?.textContent.toLowerCase();
                const taskDescription = task.querySelector('.boardCardDescription')?.textContent.toLowerCase();

                if (
                    taskTitle?.includes(searchInput) ||
                    taskDescription?.includes(searchInput)
                ) {
                    task.style.display = ''; // Zeige die Card an
                } else {
                    task.style.display = 'none'; // Verstecke die Card
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


