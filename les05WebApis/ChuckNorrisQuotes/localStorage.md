# LocalStorage

## Netwerk requests besparen (Perf matters)
Je kan een onnodige netwerk request uitsluiten door te werken met localStorage.

Als je deze oefening maakt, dan zal je opmerken dat iedere request om de categoriën op te halen, iedere keer hetzelfde resultaat geeft.

Wanneer je dat resultaat lokaal (op het toestel van de gebruiker) bewaard en gebruikt, dan zal je project sneller worden.

Deze aanpak is vooral geschikt wanneer je gebruik maakt van API's waarvan je weet dat de opgevraagde gegevens niet (of heel zelden) veranderen. In dit geval dus de categoriën.

## Algemene aanpak
* Bewaar de categoriegegevens in localStorage nadat je ze correct hebt ontvangen
* Bij het laden van je pagina kijk je na of die gegevens al bestaan in localStorage.
  * Als ze bestaan, dan werk je met die gegevens
  * Als ze nog niet bestaan, dan haal je de gegevens op

## Nota's
* De waarden die je in localStorage bewaart, moeten strings zijn. 
* Je kan objecten (dus ook Arrays) omzetten naar een string met ```JSON.stringify()```
* Je kan een JSON-geformateerde string omzetten een object met ```JSON.parse()```

## Meer info
* https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
* https://www.w3schools.com/jsref/prop_win_localstorage.asp

# Pure methodes

Probeer methodes als fetchCategories(), fetchIcon() enz... zo puur mogelijk te houden. Return bij fetchCategories() b.v. liever een array van categorieën in plaats van direct de dropdown aan te passen.