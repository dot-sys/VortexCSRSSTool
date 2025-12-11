<p align="center">
  <img src="https://dot-sys.github.io/VortexCSRSSTool/Assets/VortexLogo.svg" alt="Vortex Logo" width="100" height="100">
</p>

<h2 align="center">Vortex CSRSS Tool</h2>

<p align="center">
  Extract and visualize Windows path strings from CSRSS raw data - fast, private and browser-based. <br>
  Use here: https://dot-sys.github.io/VortexCSRSSTool/ <br><br>
  ⭐ Star this project if you found it useful.
</p>

---

### Overview
**Vortex CSRSS Tool** is a lightweight web app that extracts **Win-Path strings** from **CSRSS raw data** in JavaScript.  
All data is processed locally in your browser. **No information is stored or transmitted**.

---

### Usage
1. Extract Raw String Data from Systeminformer (explained below).
2. Paste your **raw CSRSS string results** into the input field.  
3. Click **Create**.  
4. Review the parsed and filtered output.

Filter Options:
- Filter and Sort (.exe / .dll): Extracted strings are filtered out of raw data (entries that end with .exe or .dll)
- Modified Extensions: Filters out Extensions that do not end in typical extensions found in CSRSS
- Find Associates: Shows executed files in csrss data which are from the same Folder and could be executed by the same Program.

*All Data is sorted from A-Z.*

---

### Extracting Raw Strings
To extract raw strings from csrss, best use <a href="https://systeminformer.sourceforge.io/" target="_blank"><b>SystemInformer</b></a>.

In this specific case we will make use of its **canary version**, as it usually has a more up-to-date Kernel-Mode-Driver.

1) Install and start the Program
2) Click the <img src="https://dot-sys.github.io/VortexCSRSSTool/Assets/Options.png" alt="Options Button"> Button and choose there "Enable-Kernel-Mode" Option. Restart the Program.
3) Restart the program and make sure we have Administrator-Mode activated by clicking the <img src="https://dot-sys.github.io/VortexCSRSSTool/Assets/Admin.png" alt="Admin Button"> Admin-Icon.
4) On the Top Right side search for "CSRSS" and choose the first Process in the List.
5) Doubleclick > Go to the Memories-Tab > Options > Strings
6) Choose Minimum Length 5 and Enable "Detect Unicode", "Extended Unicode", "Private" and "Mapped" Options:
<img src="https://dot-sys.github.io/VortexCSRSSTool/Assets/StringSearch.png" alt="String Search">

7) On the Bottom right side click on "Copy"
<img src="https://dot-sys.github.io/VortexCSRSSTool/Assets/CopyStrings.png" alt="Copy Strings">

8) Copy the Results on the Vortex CSRSS Tool Website in the Input Section
9) Re-Do Steps 4-8 with the Second Search-Result.

---

### Credits
- **[Eric Zimmerman’s Bstrings tool](https://github.com/EricZimmerman/bstrings)** - for the original WinPath regex  
