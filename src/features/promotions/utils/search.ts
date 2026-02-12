// Fuzzy search utility
export const fuzzySearch = (
  query: string,
  items: any[],
  keys: string[],
): any[] => {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items
    .map((item) => {
      let score = 0;

      // Search in specified keys
      keys.forEach((key) => {
        const value = String(item[key] || "").toLowerCase();

        if (value.includes(lowerQuery)) {
          // Exact substring match
          score += 10;
        } else {
          // Fuzzy matching - check if all characters appear in order
          let charIndex = 0;
          for (
            let i = 0;
            i < value.length && charIndex < lowerQuery.length;
            i++
          ) {
            if (value[i] === lowerQuery[charIndex]) {
              score += 1;
              charIndex++;
            }
          }
        }
      });

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};
