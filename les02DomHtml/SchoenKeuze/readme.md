# Schoen

Tip: druk **Ctrl+Shift+V** in VS Code om deze tekst opgemaakt weer te geven.
De HTML en CSS die je meekrijgt zijn compleet (behalve een &lt;script&gt; link in de HTML pagina); je mag er dus **niks aan wijzigen of toevoegen**.

## A. koppelen javascript

Koppel je script aan de HTML pagina:
1. maak een submap js aan
2. maak hierin een bestand scripts.js aan
3. link het aan de HTML pagina met een &lt;script&gt; blok onderaan in de &lt;body&gt; 
4. controleer of je script goed gekoppeld is, bv. met een eenvoudige 

```
console.log('ok')
```

Controleer in de console van je inspector of dit correct werkt.

## B. formchecking

Zorg ervoor dat je de theorie van de formchecking goed begrijpt. Pas formchecking toe op het email tekstvak en de dropdown. Let wel: bij deze opgave is het niet de bedoeling dat het formulier verstuurd wordt, wel dat onderaan een tekst verschijnt. Eindig de formchecking voorlopig met volgende code (in deel D. vullen we straks de correcte tekst in):

```
   ...
   // if all ok; submit form
   if (numErrors == 0) {
      lblMessage.innerHTML = `Het formulier is correct ingevuld`;
   }
});
```

## C. afbeelding en onderschrift

Dit deel is geïnspireerd op de fotogallerij uit de theorie. Zorg dat je die goed begrijpt. De code is bijna identiek. Het enige wat je nog niet weet is hoe je dat streepje onder de link kan veranderen. Dat wordt pas volgende les uitgelegd. Het komt er op neer dat je met javascript de class naam 'selected' verwijdert van de oude, en toevoegt aan de nieuwe link. De code krijg je gratis: 

```
   ...
   lnk.addEventListener('click', function(e) {
      ...
      document.querySelector('#model .selected').classList.remove('selected');
      lnk.classList.add('selected');
   });
});
```
De rest zou moeten lukken.

## D. eindtekst

Vul nu de juiste eindtekst in onderaan: gekozen model, schoenmaat, een opsomming van de gekozen accessoires en de eindprijs. In welk element vind je de tekst van het gekozen model, waar vind je de schoenmaat? Inspecteer de HTML code! Voor de opsomming van de gekozen accessoires overloop je best alle opties met een lus (bv. een forEach) om de extraprijzen en de namen te verzamelen.
