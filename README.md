# VisSatellitesUsingTLEs
The aim of this web app is to create a visualization of satellites orbiting the Earth.

## What is accurate and what is not
The positions and movement of the satellites are parsed from the TLEs(Two line element sets) obtained from [Celestrak](https://celestrak.org/) using a very helpful library called [tle.js](https://github.com/davidcalhoun/tle.js). These are accurate.
The altitude(three-dimensional distance from Earth) is approximated based on the real altitude obtained from the TLEs.

![one](https://github.com/codecruisedor/VisSatellitesUsingTLEs/assets/25024714/53ec6b15-ca51-4302-a680-81dd0eca23e4)
![two](https://github.com/codecruisedor/VisSatellitesUsingTLEs/assets/25024714/c861cbde-a037-41e9-b065-1bb6272d2ca7)
![three](https://github.com/codecruisedor/VisSatellitesUsingTLEs/assets/25024714/2a5cab19-87af-4bbe-b77f-8e436c1d62b5)
![four](https://github.com/codecruisedor/VisSatellitesUsingTLEs/assets/25024714/2fbe533f-5442-4c7b-b551-db9ee6187a61)
![five](https://github.com/codecruisedor/VisSatellitesUsingTLEs/assets/25024714/8457c23f-7161-4721-b41e-6cc73fc086be)

## Tools used
AWS lambda, BeautifulSoup, AWS EventBridge, AWS DynamoDB, Node.js, THREE.js, tle.js, HTML, CSS

## How it works
**Backend**: Celestrack updates the TLE data every three to four days. To obtain the latest data, I have created a mechanism that automates this process via AWS.
First of all,  *four* lambda functions scrap the data from the Celestrak website and populate a DynamoDB table. These functions are called via Eventbrdige every three days,
which means the end user always gets the latest data.

**Frontend**: We call the DynamoDB table and obtain all the Two line element sets from the table. The core logic then parses these TLEs and obtains the position, velocity, altitude, and other kinds of satellite data. The animation frame updates the position of satellites every second. 
All 3D objects are rendered using THREE.js.

