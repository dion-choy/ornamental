// Function to convert a Date object to a string
export function dateToString(date) {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid Date object");
  }

  // Format the date as 'YYYY-MM-DD HH:mm:ss' (example format)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to convert a string back into a Date object
export function stringToDate(dateString) {
  // Ensure the input is a valid string
  if (typeof dateString !== "string") {
    throw new Error("Invalid date string");
  }

  // Parse the string as a Date object
  const date = new Date(dateString);

  // Validate that the parsed Date is valid
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  return date;
}

// Example Usage
/*
const currentDate = new Date();
console.log("Original Date Object:", currentDate);

const dateString = dateToString(currentDate);
console.log("Date as String:", dateString);

const parsedDate = stringToDate(dateString);
console.log("Parsed Date Object:", parsedDate);
*/
