# Pixel Art Maker
A web-based interactive canvas that allows users to 
create, design, and export custom pixel art. Built with an 
intuitive drawing grid, color palette tools, and backend
 persistence for saving and loading creations.

## Features
-Interactive canvas grid:resize the grid dimension(16*16 ,
32*32 ,64*64)to customize drawing resolution

-color palette/picker:choose colors using a native color 
picker or quick-select preset swatches.

-tools:draw and erase(single Cell) and fill an entire area of the same color instantly

-export art:Download finished designs directly as PNG

-Database Integration:** Canvas drawings are converted to Data URLs (Base64) and saved directly into a SQLite database.

-Gallery Display: Fetch and display saved pixel artworks dynamically with timestamps and titles.
## used Tech
**Frontend: React, HTML5 Canvas, CSS3, JavaScript (ES6+)
**Backend: Python, Flask, REST API
**Database: SQLite
**Version Control: Git & GitHub


### Prerequisites
* [Node.js](https://nodejs.org/)
 installed
* [Python 3.x](https://www.python.org/) installed

1. Clone the repository
```bash
git clone [https://github.com/
YOUR_GITHUB_USERNAME/
YOUR_REPOSITORY_NAME.git](https://
github.com/YOUR_GITHUB_USERNAME/
YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME

. Run the Frontend (React)
Open a second terminal and navigate to 
the frontend directory:

Bash
cd frontend
npm install
npm run dev
(Frontend running on http://localhost:5173 or as indicated by Vite)