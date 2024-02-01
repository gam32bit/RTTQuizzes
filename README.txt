#Website featuring interactive monthly quizzes for the Round the Triangle newsletter

## Getting Started

- I talked with ChatGPT to brainstorm how to go about this project and how to structure the repo. 
- I created on a repo on GitHub as well as the starting files and folders.
- ChatGPT's initial suggestions for CSS look good, got the card format the way I wanted.
- Figured out how to link button to quiz page and how to get it to load json file with monthly quiz info
- Got Javascript to load for quiz page, which involved adding html elements to the quiz page
- highlights work to show correct and incorrect answers, and additional context by adding html element (is this best solution?)
- Got visual feedback to stop after first selection by adding a "flag" which is a boolean that checks is an answer has been selected and then removes event listeners
- Made additional context appear below relevant question by adding element within quiz container
- When quiz is complete message appears showing final score, had to change scope of some variables
- Added reset capability, needed to make sure that variables were properly reset
- Fixed bug with multiple selections being made on one question by adding an "answered" class to keep track of selections made per question

##TO DO
- Add a link to the home page
- adjust styling for reset button
- add email hyperlink functionality
- embed Google Analytics
- put thumbnail preview in header
- Create actual ReadME
- add source hyperlink underneath additional context
- add capability to include photo in additional context or above question
- Fix css on home page so that # cards in row adapts to screen size
- Figure out how to load different quizzes depending on which button on the home page is pressed.

## Bonus

- showing average score at end
