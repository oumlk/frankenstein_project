// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});

// Function to transform the text encoded in TEI with the XSL stylesheet "Frankenstein_text.xsl"
function documentLoader() {
  Promise.all([
    fetch(folio_xml).then(response => response.text()),
    fetch("Frankenstein_text.xsl").then(response => response.text())
  ])
  .then(function ([xmlString, xslString]) {
    var parser = new DOMParser();
    var xml_doc = parser.parseFromString(xmlString, "text/xml");
    var xsl_doc = parser.parseFromString(xslString, "text/xml");

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl_doc);
    var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

    var criticalElement = document.getElementById("text");
    criticalElement.innerHTML = ''; // Clear existing content
    criticalElement.appendChild(resultDocument);
  })
  .catch(function (error) {
    console.error("Error loading documents:", error);
  });
}

// Function to transform the metadata encoded in teiHeader with the XSL stylesheet "Frankenstein_meta.xsl"
function statsLoader() {
  Promise.all([
    fetch(folio_xml).then(response => response.text()),
    fetch("Frankenstein_meta.xsl").then(response => response.text())
  ])
  .then(function ([xmlString, xslString]) {
    var parser = new DOMParser();
    var xml_doc = parser.parseFromString(xmlString, "text/xml");
    var xsl_doc = parser.parseFromString(xslString, "text/xml");

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl_doc);
    var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

    var criticalElement = document.getElementById("stats");
    criticalElement.innerHTML = ''; // Clear existing content
    criticalElement.appendChild(resultDocument);
  })
  .catch(function (error) {
    console.error("Error loading documents:", error);
  });
}

// Initial document load
documentLoader();
statsLoader();

// Function to handle hand selection
function selectHand(event) {
  var visible_mary = document.getElementsByClassName('MWS'); 
  var visible_percy = document.getElementsByClassName('PBS'); 
  
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);

  if (event.target.value == 'both') {
    // Show all text written and modified by both hands (default color)
    MaryArray.forEach(function(element) {
      element.style.color = 'black';
      element.style.backgroundColor = 'transparent';
    });
    PercyArray.forEach(function(element) {
      element.style.color = 'black';
      element.style.backgroundColor = 'transparent';
    });
  } else if (event.target.value == 'Mary') {
    // Highlight Mary Shelley's text, and show Percy's text in black
    MaryArray.forEach(function(element) {
      element.style.color = 'blue';
      element.style.backgroundColor = 'lightyellow'; // Highlight color
    });
    PercyArray.forEach(function(element) {
      element.style.color = 'black';
      element.style.backgroundColor = 'transparent';
    });
  } else if (event.target.value == 'Percy') {
    // Highlight Percy Shelley's text, and show Mary's text in black
    PercyArray.forEach(function(element) {
      element.style.color = 'red';
      element.style.backgroundColor = 'lightgreen'; // Highlight color
    });
    MaryArray.forEach(function(element) {
      element.style.color = 'black';
      element.style.backgroundColor = 'transparent';
    });
  }
}


document.getElementById('handSelector').addEventListener('change', selectHand);

// Function to toggle the display of deletions
function toggleDeletions() {
  var deletions = document.getElementsByTagName('del');
  var deletionsArray = Array.from(deletions);

  deletionsArray.forEach(function(element) {
    if (element.style.display === 'none') {
      element.style.display = 'inline';
    } else {
      element.style.display = 'none';
    }
  });
}


document.getElementById('toggleDeletionsBtn').addEventListener('click', toggleDeletions);

// Function to display the text as a reading text (removing deletions and showing additions inline)
function showReadingText() {
  // Remove deletions
  var deletions = document.getElementsByTagName('del');
  var deletionsArray = Array.from(deletions);
  deletionsArray.forEach(function(element) {
    element.style.display = 'none';
  });

 
  var additions = document.getElementsByClassName('supraAdd');
  var additionsArray = Array.from(additions);
  additionsArray.forEach(function(element) {
    element.style.position = 'static';
    element.style.fontSize = 'inherit';
    element.style.top = '0';
    element.style.color = 'inherit'; // Optional, reset color
  });
}


document.getElementById('showReadingTextBtn').addEventListener('click', showReadingText);
