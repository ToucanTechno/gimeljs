In order for this to run properly, we should let chrome download files from our computer.
To do so:
1. Close Chrome
2. Open CMD
3. Run the following command line:
$ "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files "<PATH_TO...>\gimeljs\index.html"
Voila! The renderer should work!