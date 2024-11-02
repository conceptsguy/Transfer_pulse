interface Activity {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  duration?: number;
  predecessors?: string[];
}

export const parseXER = async (file: File): Promise<Activity[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const activities: Activity[] = [];

        // Split the file content into lines
        const lines = content.split('\n');
        let currentSection = '';

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Identify section headers
          if (trimmedLine.startsWith('%T')) {
            currentSection = trimmedLine.split('\t')[1];
            continue;
          }

          // Process TASK section
          if (currentSection === 'TASK' && !trimmedLine.startsWith('%')) {
            const fields = trimmedLine.split('\t');
            
            // Basic validation
            if (fields.length < 3) continue;

            activities.push({
              id: fields[0],
              name: fields[1],
              description: fields[2],
              duration: parseInt(fields[3]) || undefined,
              startDate: fields[4],
              predecessors: [],
            });
          }

          // Process TASKPRED section (relationships)
          if (currentSection === 'TASKPRED' && !trimmedLine.startsWith('%')) {
            const fields = trimmedLine.split('\t');
            
            // Basic validation
            if (fields.length < 2) continue;

            const task = activities.find(a => a.id === fields[1]);
            if (task && !task.predecessors?.includes(fields[0])) {
              task.predecessors = [...(task.predecessors || []), fields[0]];
            }
          }
        }

        resolve(activities);
      } catch (error) {
        reject(new Error('Failed to parse XER file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read XER file'));
    };

    reader.readAsText(file);
  });
};