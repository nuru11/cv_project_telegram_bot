// const { Telegraf } = require("telegraf");
// const TOKEN = "6488350546:AAE_c3Dcen7cnxLraZOCf5S_7MYEPgEEVoA";
// const bot = new Telegraf(TOKEN);


// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const web_link = "https://ntechagent.com"; 

// bot.start((ctx) =>
//   ctx.reply("Welcome :)))))", {
//     reply_markup: {
//       keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
//     },
//   })
// );

// bot.launch();

///////////////////////////////////////////////////////////////////////////////

// const { Telegraf } = require("telegraf");
// const LocalSession = require('telegraf-session-local'); // Import the session middleware
// const axios = require('axios'); // Add axios for making HTTP requests
// const TOKEN = "6488350546:AAE_c3Dcen7cnxLraZOCf5S_7MYEPgEEVoA"; // Replace with your actual token
// const bot = new Telegraf(TOKEN);

// // Step 1: Set up local session middleware
// const session = new LocalSession({ database: 'session_db.json' }); // Specify a database file
// bot.use(session);

// const express = require('express');
// const app = express();
// app.use(express.json()); // Middleware to parse JSON

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const web_link = "https://testcv.ntechagent.com";

// // Start command
// bot.start((ctx) => {
//   ctx.reply("Welcome! Use /login to access your account.");
// });

// // Login command
// bot.command('login', (ctx) => {
//   ctx.reply("Please enter your username:");
//   ctx.session.waitingFor = 'username'; // Set state to waiting for username
// });

// // Handle text messages
// bot.on('text', async (ctx) => {
//   const waitingFor = ctx.session.waitingFor;

//   if (waitingFor === 'username') {
//     ctx.session.username = ctx.message.text; // Store the username
//     ctx.reply("Please enter your password:");
//     ctx.session.waitingFor = 'password'; // Change state to waiting for password
//   } else if (waitingFor === 'password') {
//     const password = ctx.message.text;
//     const username = ctx.session.username;

//     try {
//       const response = await axios.post('https://testcvapi.ntechagent.com/api/auth/login', {
//         username,
//         password
//       });

//       // Handle successful login
//       const { token, agentName } = response.data;
//       ctx.reply(`Login successful! Welcome, ${agentName}. You can now access the web app or log out.`, {
//         reply_markup: {
//           keyboard: [
//             [{ text: "Access Web App" }],
//             [{ text: "Logout" }]
//           ],
//           resize_keyboard: true,
//           one_time_keyboard: true
//         }
//       });

//       // Store the token in session
//       ctx.session.token = token;

//       // Reset session data
//       delete ctx.session.waitingFor;
//       delete ctx.session.username;
//     } catch (error) {
//       ctx.reply('Login failed. Please check your credentials and try again.');
//       console.error(error.response ? error.response.data : error.message);

//       // Reset session data
//       delete ctx.session.waitingFor;
//       delete ctx.session.username;
//     }
//   } else {
//     ctx.reply('Please use /login to start the login process.');
//   }
// });

// // Access the web app link
// bot.hears('Access Web App', (ctx) => {
//   if (ctx.session.token) {
//     ctx.reply(`You are logged in! Access the web app here: ${web_link}`);
//   } else {
//     ctx.reply('You must log in first to access the web app. Use /login to log in.');
//   }
// });

// // Logout command
// bot.hears('Logout', (ctx) => {
//   // Clear session data
//   delete ctx.session.token;
//   delete ctx.session.username;
//   delete ctx.session.waitingFor;

//   ctx.reply('You have been logged out. Please use /login to log in again.');
// });

// // Launch the bot
// bot.launch();


/////////////////////////////////////////////////////////




const { Telegraf } = require("telegraf");
const LocalSession = require('telegraf-session-local'); // Import the session middleware
const https = require('https'); // Import the https module
const express = require('express'); // Import express

const TOKEN = "6488350546:AAE_c3Dcen7cnxLraZOCf5S_7MYEPgEEVoA"; // Replace with your actual bot token
const bot = new Telegraf(TOKEN);

// Step 1: Set up local session middleware
const session = new LocalSession({ database: 'session_db.json' }); // Specify a database file
bot.use(session);

// Set up Express server
const app = express();
app.use(express.json()); // Middleware to parse JSON

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Start command
bot.start((ctx) => {
    ctx.reply("Welcome! Use /login to access your account.");
});

// Login command
bot.command('login', (ctx) => {
    ctx.reply("Please enter your username:");
    ctx.session.waitingFor = 'username'; // Set state to waiting for username
});

// Handle text messages
bot.on('text', (ctx) => {
    const waitingFor = ctx.session.waitingFor;

    if (waitingFor === 'username') {
        ctx.session.username = ctx.message.text; // Store the username
        ctx.reply("Please enter your password:");
        ctx.session.waitingFor = 'password'; // Change state to waiting for password
    } else if (waitingFor === 'password') {
        const password = ctx.message.text;
        const username = ctx.session.username;

        const postData = JSON.stringify({ username, password });

        const options = {
            hostname: 'testcvapi.ntechagent.com',
            port: 443,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
            timeout: 10000000, // Set a reasonable timeout (10 seconds)
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('Response from server:', response); // Log the response

                    const { token, agentName } = response;
                    ctx.reply(`Login successful! Welcome, ${agentName}. You can now access the web app or log out.`, {
                        reply_markup: {
                            keyboard: [
                                [{ text: `Access Web App ${agentName}` }],
                                [{ text: "Logout" }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });

                    // Store the token and agentName in session
                    ctx.session.token = token;
                    ctx.session.agentName = agentName; // Save agentName for later use

                    // Initialize pagination
                    ctx.session.offset = 0; // Initialize offset
                    ctx.session.limit = 10; // Initialize limit

                    // Reset session data
                    delete ctx.session.waitingFor;
                    delete ctx.session.username;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    ctx.reply('An error occurred while processing your request. Please try again.');
                }
            });
        });

        req.setTimeout(10000000, () => { // Set timeout for the request
            console.error('Request timed out');
            ctx.reply('Login request timed out. Please try again later.');
            req.abort(); // Abort the request if it times out
        });

        // Handle request errors
        req.on('error', (error) => {
            console.error('Request error:', error);
            ctx.reply('Login failed due to a connection issue. Please check your credentials and try again.');
            
            // Optionally implement retry logic
            if (error.code === 'ECONNRESET') {
                ctx.reply('The connection was reset. Please try again.');
            }
        });

        req.write(postData);
        req.end();
    } else if (ctx.message.text.startsWith("Access Web App")) {
        console.log("Web app accessed"); // Log when the web app is accessed
        fetchApplicants(ctx); // Fetch the list of applicants
    } else if (ctx.message.text === "Logout") {
        console.log("User logged out");
        ctx.session = {}; // Clear the entire session
        ctx.reply('You have successfully logged out. Use /login to access your account again.', {
            reply_markup: {
                keyboard: [
                    [{ text: "/login" }] // Show only the login button
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else {
        ctx.reply('Please use /login to start the login process.');
    }
});

// Function to fetch applicants from the new API
function fetchApplicants(ctx) {
    const agentName = ctx.session.agentName; // Retrieve agentName from session
    const offset = ctx.session.offset || 0; // Ensure offset is initialized
    const limit = ctx.session.limit || 10; // Ensure limit is initialized

    console.log(`Fetching applicants with agentName: ${agentName}, offset: ${offset}, limit: ${limit}`);

    const fetchOptions = {
        hostname: 'testcvapi.ntechagent.com',
        port: 443,
        path: `/allapplicantforbot?agentname=${encodeURIComponent(agentName)}&offset=${offset}&limit=${limit}`,
        method: 'GET',
        timeout: 10000000, // Set a reasonable timeout (10 seconds)
    };

    const fetchReq = https.request(fetchOptions, (fetchRes) => {
        let fetchData = '';

        fetchRes.on('data', (chunk) => {
            fetchData += chunk;
        });

        fetchRes.on('end', () => {
            clearTimeout(timeoutHandle); // Clear the timeout if the request completes
            try {
                const fetchResponse = JSON.parse(fetchData);
                console.log('Fetch response from server:', fetchResponse); // Log the fetch response

                if (fetchResponse.status === 'ok') {
                    const applicants = fetchResponse.data; // Get the list of applicants
                    if (applicants.length === 0) {
                        ctx.reply('No more applicants to display.');
                        return;
                    }

                    // Send each applicant's image and name with a "Detail" button
                    const applicantPromises = applicants.map(applicant => {
                        return new Promise((resolve) => {
                            const applicantName = `${applicant.name} ${applicant.surname}`;
                            const applicantImageUrl = `https://testcvapi.ntechagent.com/applicantimagetest/${applicant.personalimage}`;

                            // Check if personal image exists
                            if (applicant.personalimage) {
                                ctx.replyWithPhoto(applicantImageUrl, {
                                    caption: applicantName,
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: "Detail",
                                                    callback_data: `detail_${applicant.createdAt}` // Ensure this is correct
                                                }
                                            ]
                                        ]
                                    }
                                }).then(() => resolve()).catch(() => resolve());
                            } else {
                                // If no personal image, send the name with "Detail" button
                                ctx.reply(applicantName, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: "Detail",
                                                    callback_data: `detail_${applicant.createdAt}` // Ensure this is correct
                                                }
                                            ]
                                        ]
                                    }
                                }).then(() => resolve()).catch(() => resolve());
                            }
                        });
                    });

                    // Wait for all applicant messages to be sent
                    Promise.all(applicantPromises).then(() => {
                        ctx.reply('What would you like to do next?', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "More", callback_data: "more" }], // Ensure this is the correct callback data
                                    [{ text: "Logout", callback_data: "logout" }]
                                ]
                            }
                        });

                        // Increment offset for the next fetch
                        ctx.session.offset += ctx.session.limit;
                    });

                } else {
                    ctx.reply('Failed to retrieve applicant data.');
                }
            } catch (error) {
                console.error('Error parsing fetch response:', error);
                ctx.reply('An error occurred while retrieving applicant data.');
            }
        });
    });

    let timeoutHandle = setTimeout(() => {
        fetchReq.abort(); // Abort the request if it times out
        ctx.reply('The request has timed out. Please try again later.');
    }, 10000000); // Timeout duration (10 seconds)

    fetchReq.on('error', (error) => {
        clearTimeout(timeoutHandle); // Clear the timeout on error
        console.error('Error fetching applicant data:', error);
        ctx.reply('Failed to fetch applicant data. Please try again later.');
    });

    fetchReq.end();
}

// Function to fetch applicant details using createdAt
function fetchApplicantDetails(ctx, createdAt) {
    const requestUrl = `/detail/tget-images?createdAt=${encodeURIComponent(createdAt)}&agentname=admin`;

    const fetchOptions = {
        hostname: 'testcvapi.ntechagent.com',
        port: 443,
        path: requestUrl,
        method: 'GET',
        timeout: 10000000, // Set a reasonable timeout (10 seconds)
    };

    const fetchReq = https.request(fetchOptions, (fetchRes) => {
        let fetchData = '';

        fetchRes.on('data', (chunk) => {
            fetchData += chunk;
        });

        fetchRes.on('end', () => {
            clearTimeout(timeoutHandle); // Clear the timeout if the request completes
            console.log('HTTP Status Code:', fetchRes.statusCode); // Log the status code
            if (fetchRes.statusCode !== 200) {
                ctx.reply('Failed to retrieve applicant details. Please try again.');
                return;
            }

            try {
                const fetchResponse = JSON.parse(fetchData);
                console.log('Applicant details response:', fetchResponse); // Log the JSON response

                if (fetchResponse.status === 'ok') {
                    const applicant = fetchResponse.data; // Assuming the response structure contains data

                    const shortCaption = `Name: ${applicant.name} ${applicant.middleName}${applicant.age ? "\nAge: " : ""}${applicant.age}\nExperienced: ${JSON.parse(applicant.experience)[0].name !== "" ? "Experienced" : "First Time"}`;

                    if (applicant.personalImageUrl) {
                        ctx.replyWithPhoto(applicant.personalImageUrl, { caption: shortCaption })
                            .then(() => {
                                const detailsMessage = `
                                    *Middle Name:* ${applicant.middleName}
                                    *Family Name:* ${applicant.familyName}
                                    *Application No:* ${applicant.applicationNo}
                                    *Sex:* ${applicant.sex}
                                    *Place of Birth:* ${applicant.placeofbirth}
                                    *Nationality:* ${applicant.nationality}
                                    *Marital Status:* ${applicant.martialstatus}
                                    *Date of Birth:* ${applicant.dateofbirth}
                                    *Email:* ${applicant.email}
                                `;
                                // ctx.reply(detailsMessage, { parse_mode: 'Markdown' }); // Send additional details
                            });
                    } else {
                        ctx.reply(shortCaption); // If no personal image, just send the short caption
                    }

                    if (applicant.videoUrl) {
                        // Check if the video URL is accessible
                        https.get(applicant.videoUrl, (videoRes) => {
                            if (videoRes.statusCode === 200) {
                                const contentType = videoRes.headers['content-type'];
                                if (contentType && contentType.startsWith('video/')) {
                                    ctx.replyWithVideo(applicant.videoUrl, { 
                                        caption: shortCaption // Using the short caption
                                    })
                                    .catch(err => {
                                        console.error('Error sending video:', err);
                                        ctx.reply('Failed to send the video. Please check the video format and size.');
                                    });
                                } else {
                                    console.error('Invalid content type:', contentType);
                                    ctx.reply('The video URL does not point to a valid video file.');
                                }
                            } else {
                                console.error('Video URL returned status code:', videoRes.statusCode);
                                ctx.reply('The video is not accessible at the moment.');
                            }
                        }).on('error', (err) => {
                            console.error('Error accessing video URL:', err);
                            ctx.reply('The video is not accessible at the moment.');
                        });
                    }
                } else {
                    ctx.reply('Failed to retrieve applicant details.');
                }
            } catch (error) {
                console.error('Error parsing applicant details response:', error);
                ctx.reply('An error occurred while retrieving applicant details.');
            }
        });
    });

    let timeoutHandle = setTimeout(() => {
        fetchReq.abort(); // Abort the request if it times out
        ctx.reply('The request has timed out. Please try again later.');
    }, 10000000); // Timeout duration (10 seconds)

    fetchReq.on('error', (error) => {
        clearTimeout(timeoutHandle); // Clear the timeout on error
        console.error('Error fetching applicant details:', error);
        ctx.reply('Failed to fetch applicant details. Please try again later.');
    });

    fetchReq.end();
}
// Handle callback queries
bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data;
    console.log('Callback data:', data); // Debug log

    if (data.startsWith("detail_")) {
        const createdAt = data.split("_")[1]; // Extract createdAt from callback data
        console.log('Detail button pressed for createdAt:', createdAt); // Log for debugging
        fetchApplicantDetails(ctx, createdAt); // Fetch and display details for the applicant
    } else if (data === "more") {
        console.log("More button pressed"); // Log when the "More" button is pressed
        fetchApplicants(ctx); // Fetch the next set of applicants
    } else if (data === "logout") {
        console.log("User logged out");
        ctx.session = {}; // Clear the entire session
        ctx.reply('You have successfully logged out. Use /login to access your account again.', {
            reply_markup: {
                keyboard: [
                    [{ text: "/login" }] // Show only the login button
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});

// Launch the bot
bot.launch().catch((err) => {
    console.error("Error while launching the bot:", err);
});


//////////////////////////////////////////////////////////////////////////



// const { Telegraf } = require("telegraf");
// const LocalSession = require('telegraf-session-local'); // Import the session middleware
// const https = require('https'); // Import the https module
// const express = require('express'); // Import express

// const TOKEN = "6488350546:AAE_c3Dcen7cnxLraZOCf5S_7MYEPgEEVoA"; // Replace with your actual bot token
// const bot = new Telegraf(TOKEN);

// // Step 1: Set up local session middleware
// const session = new LocalSession({ database: 'session_db.json' }); // Specify a database file
// bot.use(session);

// // Set up Express server
// const app = express();
// app.use(express.json()); // Middleware to parse JSON

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// // Start command
// bot.start((ctx) => {
//     ctx.reply("Welcome! Use /login to access your account.");
// });

// // Login command
// bot.command('login', (ctx) => {
//     ctx.reply("Please enter your username:");
//     ctx.session.waitingFor = 'username'; // Set state to waiting for username
// });

// // Handle text messages
// bot.on('text', (ctx) => {
//     const waitingFor = ctx.session.waitingFor;

//     if (waitingFor === 'username') {
//         ctx.session.username = ctx.message.text; // Store the username
//         ctx.reply("Please enter your password:");
//         ctx.session.waitingFor = 'password'; // Change state to waiting for password
//     } else if (waitingFor === 'password') {
//         const password = ctx.message.text;
//         const username = ctx.session.username;

//         const postData = JSON.stringify({ username, password });

//         const options = {
//             hostname: 'testcvapi.ntechagent.com',
//             port: 443,
//             path: '/api/auth/login',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Content-Length': Buffer.byteLength(postData),
//             },
//             timeout: 5000, // Set a timeout in milliseconds (e.g., 5000ms = 5 seconds)
//         };

//         const req = https.request(options, (res) => {
//             let data = '';

//             res.on('data', (chunk) => {
//                 data += chunk;
//             });

//             res.on('end', () => {
//                 try {
//                     const response = JSON.parse(data);
//                     console.log('Response from server:', response); // Log the response here
//                     const { token, agentName } = response;
//                     ctx.reply(`Login successful! Welcome, ${agentName}. You can now access the web app or log out.`, {
//                         reply_markup: {
//                             keyboard: [
//                                 [{ text: `Access Web App ${agentName}` }],
//                                 [{ text: "Logout" }]
//                             ],
//                             resize_keyboard: true,
//                             one_time_keyboard: true
//                         }
//                     });

//                     // Store the token and agentName in session
//                     ctx.session.token = token;
//                     ctx.session.agentName = agentName; // Save agentName for later use

//                     // Reset session data
//                     delete ctx.session.waitingFor;
//                     delete ctx.session.username;
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                     ctx.reply('An error occurred while processing your request. Please try again.');
//                 }
//             });
//         });

//         req.setTimeout(5000, () => {
//             console.error('Request timed out');
//             ctx.reply('Login request timed out. Please try again later.');
//         });

//         // Handle request errors
//         req.on('error', (error) => {
//             ctx.reply('Login failed. Please check your credentials and try again.');
//             console.error('Request error:', error);
//         });

//         req.write(postData);
//         req.end();
//     } else if (ctx.message.text.startsWith("Access Web App")) {
//         console.log("Web app accessed"); // Log when the web app is accessed

//         // Initialize pagination variables
//         ctx.session.offset = 0; // Starting offset
//         ctx.session.limit = 10; // Number of applicants to fetch

//         fetchApplicants(ctx); // Fetch the first batch of applicants
//     } else if (ctx.message.text === "More") {
//         ctx.session.offset += ctx.session.limit; // Increase offset for the next batch
//         fetchApplicants(ctx); // Fetch the next batch of applicants
//     } else if (ctx.message.text === "Logout") {
//         console.log("User logged out");
//         // Clear session data
//         ctx.session = {}; // Clear the entire session
//         ctx.reply('You have successfully logged out. Use /login to access your account again.', {
//             reply_markup: {
//                 keyboard: [
//                     [{ text: "/login" }] // Show only the login button
//                 ],
//                 resize_keyboard: true,
//                 one_time_keyboard: true
//             }
//         });
//     } else {
//         ctx.reply('Please use /login to start the login process.');
//     }
// });

// // Function to fetch applicants from the API
// function fetchApplicants(ctx) {
//     const agentName = ctx.session.agentName; // Retrieve agentName from session
//     const { offset, limit } = ctx.session; // Get pagination values

//     const fetchOptions = {
//         hostname: 'testcvapi.ntechagent.com',
//         port: 443,
//         path: `/allapplicantforbot?agentname=${agentName}&offset=${offset}&limit=${limit}`,
//         method: 'GET',
//     };

//     const fetchReq = https.request(fetchOptions, (fetchRes) => {
//         let fetchData = '';

//         fetchRes.on('data', (chunk) => {
//             fetchData += chunk;
//         });

//         fetchRes.on('end', () => {
//             try {
//                 const fetchResponse = JSON.parse(fetchData);
//                 console.log('Fetch response from server:', fetchResponse); // Log the fetch response

//                 if (fetchResponse.status === 'ok') {
//                     const applicants = fetchResponse.data; // Get the list of applicants
//                     if (applicants.length === 0) {
//                         ctx.reply('No more applicants to display.');
//                         return;
//                     }

//                     // Send each applicant's image and name with a "Detail" button
//                     const applicantPromises = applicants.map(applicant => {
//                         return new Promise((resolve) => {
//                             const applicantImageUrl = `https://testcvapi.ntechagent.com/applicantimagetest/${applicant.personalimage}`;
//                             const applicantName = `${applicant.name} ${applicant.surname}`;

//                             if (applicant.personalimage) {
//                                 ctx.replyWithPhoto(applicantImageUrl, {
//                                     caption: applicantName,
//                                     reply_markup: {
//                                         inline_keyboard: [
//                                             [
//                                                 {
//                                                     text: "Detail",
//                                                     callback_data: `detail_${applicant.passportnum}`
//                                                 }
//                                             ]
//                                         ]
//                                     }
//                                 }).then(() => resolve()).catch(() => resolve());
//                             } else {
//                                 ctx.reply(applicantName, {
//                                     reply_markup: {
//                                         inline_keyboard: [
//                                             [
//                                                 {
//                                                     text: "Detail",
//                                                     callback_data: `detail_${applicant.passportnum}`
//                                                 }
//                                             ]
//                                         ]
//                                     }
//                                 }).then(() => resolve()).catch(() => resolve());
//                             }
//                         });
//                     });

//                     // Wait for all applicant messages to be sent
//                     Promise.all(applicantPromises).then(() => {
//                         ctx.reply('What would you like to do next?', {
//                             reply_markup: {
//                                 inline_keyboard: [
//                                     [{ text: "More", callback_data: "more" }],
//                                     [{ text: "Logout", callback_data: "logout" }]
//                                 ]
//                             }
//                         });
//                     });

//                 } else {
//                     ctx.reply('Failed to retrieve applicant data.');
//                 }
//             } catch (error) {
//                 console.error('Error parsing fetch response:', error);
//                 ctx.reply('An error occurred while retrieving applicant data.');
//             }
//         });
//     });

//     fetchReq.on('error', (error) => {
//         console.error('Error fetching applicant data:', error);
//         ctx.reply('Failed to fetch applicant data. Please try again later.');
//     });

//     fetchReq.end();
// }

// // Function to fetch applicant details by passport number
// function fetchApplicantDetails(ctx, passportnum) {
//     const fetchOptions = {
//         hostname: 'testcvapi.ntechagent.com',
//         port: 443,
//         path: `/applicantdetails?passportnum=${passportnum}`, // Adjust this path based on your API
//         method: 'GET',
//     };

//     const fetchReq = https.request(fetchOptions, (fetchRes) => {
//         let fetchData = '';

//         fetchRes.on('data', (chunk) => {
//             fetchData += chunk;
//         });

//         fetchRes.on('end', () => {
//             try {
//                 const fetchResponse = JSON.parse(fetchData);
//                 console.log('Applicant details response:', fetchResponse); // Log the response

//                 if (fetchResponse.status === 'ok') {
//                     const applicant = fetchResponse.data[0]; // Assuming the response structure
//                     // Format the details into a message
//                     const detailsMessage = `
//                         *Name:* ${applicant.name} ${applicant.surname}
//                         *Middle Name:* ${applicant.middleName}
//                         *Family Name:* ${applicant.familyName}
//                         *Application No:* ${applicant.applicationNo}
//                         *Sex:* ${applicant.sex}
//                         *Place of Birth:* ${applicant.placeofbirth}
//                         *Nationality:* ${applicant.nationality}
//                         *Marital Status:* ${applicant.martialstatus}
//                         *Date of Birth:* ${applicant.dateofbirth}
//                         *Email:* ${applicant.email}
//                         *Status:* ${applicant.status}
//                     `;

//                     if (applicant.personalimage) {
//                         const applicantImageUrl = `https://testcvapi.ntechagent.com/applicantimagetest/${applicant.personalimage}`;
//                         ctx.replyWithPhoto(applicantImageUrl, { caption: detailsMessage });
//                     } else {
//                         ctx.reply(detailsMessage);
//                     }
//                 } else {
//                     ctx.reply('Failed to retrieve applicant details.');
//                 }
//             } catch (error) {
//                 console.error('Error parsing applicant details response:', error);
//                 ctx.reply('An error occurred while retrieving applicant details.');
//             }
//         });
//     });

//     fetchReq.on('error', (error) => {
//         console.error('Error fetching applicant details:', error);
//         ctx.reply('Failed to fetch applicant details. Please try again later.');
//     });

//     fetchReq.end();
// }

// // Handle callback queries
// bot.on('callback_query', (ctx) => {
//     const data = ctx.callbackQuery.data;

//     if (data.startsWith("detail_")) {
//         const passportnum = data.split("_")[1]; // Extract passport number from callback data
//         fetchApplicantDetails(ctx, passportnum); // Fetch and display details for the applicant
//     } else if (data === "more") {
//         ctx.session.offset += ctx.session.limit; // Increase offset for the next batch
//         fetchApplicants(ctx); // Fetch the next batch of applicants
//     } else if (data === "logout") {
//         console.log("User logged out");
//         ctx.session = {}; // Clear the entire session
//         ctx.reply('You have successfully logged out. Use /login to access your account again.', {
//             reply_markup: {
//                 keyboard: [
//                     [{ text: "/login" }] // Show only the login button
//                 ],
//                 resize_keyboard: true,
//                 one_time_keyboard: true
//             }
//         });
//     }
// });

// // Launch the bot
// bot.launch().catch((err) => {
//     console.error("Error while launching the bot:", err);
// });