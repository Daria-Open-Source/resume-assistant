# Resume-Assistant
A resume analysis tool for RPI students. It takes a resume and query, and provides improvements based on objectives contextualized by resumes from a database. 

===
## Summary of Action
1. User uploads PDF + query
2. PDF turns to Text then Chunked Sections
3. Embed query with MixedBread API
4. Vector search MongoDB Atlas (per section)
5. Groq LLM (llama-3.3-70b) generates JSON feedback
6. Structured recruiter analysis returned to user

===
## Our Goal 
Today finding success in a field is harder than ever, you are constantly competing with people for something that not long ago was a lot easier. Our goal is to help you succeed in your desired field by putting your best step forward by helping with resume building, skill building, and career building. 

## What we do !
We compare your resume to resumes from past students that have found success in what you are looking for. We can help optimize your current resume by adjusting your resume based on the field of work you'd like to get into, while proposing new projects and skills to make you the prefect candidate for your dream job!

## How we do it!
We first take your provided resume, and break that up in pieces and extract the important information. We have a database of many past students who have found success in there desired field. We compare their accomplishments, skills and experiences listed on there resume and compare them to yours. After the comparison, we then list out the strengths and weaknesses of your resume, and we give actionable steps so they can address gaps. 

===
## Version
v1.0 - 05.01.2026
===
## License
The MIT License (MIT)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
