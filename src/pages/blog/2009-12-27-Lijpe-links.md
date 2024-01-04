---
layout: "../../layouts/BlogPostLayout.astro"
title: Lijpe links
date: 2009-12-27
description: "Links lijken naast koppen, paragrafen en afbeeldingen de meest basale elementen van een web pagina. Helaas lijkt het er op dat aan deze links in veel gevallen ook slechts de meest basale visuele stijl wordt toegekend. Je kent het wel, een lijntje onder de tekst en een afwijkend kleurtje, en we hebben de visuele stijl van een link. Als de hele wereld zo in elkaar zou zitten zou het maar een saaie boel worden en daarnaast (iets veel essentiëlers) zouden we geen gebruik maken van de mogelijkheid om onze gebruikers te voorzien van additionele informatie over de link (metadata), een gemiste kans. Vooral de komst van CSS3 levert ons nieuwe mogelijkheden voor het stijlen van links op een manier waardoor het object link een complete transformatie door kan maken ten opzichte van de zojuist omschreven traditionele verschijning."
tags: tags css
draft: yes
dutch: yes
---


## Heading 2

1st prize. 
Links lijken naast koppen, paragrafen en afbeeldingen de meest basale elementen van een web pagina. Helaas lijkt het er op dat aan deze links in veel gevallen ook slechts de meest basale visuele stijl wordt toegekend. Je kent het wel, een lijntje onder de tekst en een afwijkend kleurtje, en we hebben de visuele stijl van een link. Als de hele wereld zo in elkaar zou zitten zou het maar een saaie boel worden en daarnaast (iets veel essentiÃ«lers) zouden we geen gebruik maken van de mogelijkheid om onze gebruikers te voorzien van additionele informatie over de link (metadata), een gemiste kans. Vooral de komst van CSS3 levert ons nieuwe mogelijkheden voor het stijlen van links op een manier waardoor het object link een complete transformatie door kan maken ten opzichte van de zojuist omschreven traditionele verschijning.

### De zin en onzin van metadata
Een alom bekende irritatiefactor is het feit dat een boel links worden geopend in een nieuw browservenster (of tab). Ik ben daar eens over na gaan denken en volgens mij is het niet het feit dat het scherm in een nieuw scherm opent het grote probleem maar het feit dat de gebruiker niet het idee krijgt dat hij controle heeft over wat hij doet. Als de gebruiker zou weten dat het scherm zou openen in een nieuw venster zou hij zich in kunnen stellen op deze situatie en de situatie sneller accepteren waardoor zijn bezoek aan de site plezieriger wordt.
Hetzelfde geldt voor het mooie mail linkje dat maar al te vaak je persoonlijke mailclient gaat starten om een mailtje te componeren naar je ontvanger, en hoe vaak gebeurt het dat je op een link klikt en je browser direct een bestand begint te downloaden? Precies, had je dit van tevoren geweten had je er even over nagedacht, of had je des te sneller de link kunnen vinden met die ene download.

Een mogelijke oplossing van dit probleem is de toevoeging van iconen aan je link.

Met een simpel regeltje CSS kun je een icoon toevoegen aan een link

```css
a {
  padding-right: 20px;
  background: url(new-window.png) no-repeat right center;
}
```

#### Heading 4
Hiermee wordt een icoontje toegevoegd aan de link en afhankelijk van het ontwerp van je icoon zal de gebruiker weten wat er staat te gebeuren. So far so good. Het probleem is echter dat je dit echt niet wilt voor al je links, toch? De links die intern binnen je site verwijzen hebben een dergelijk icoon niet nodig.

CSS2 to the rescue! Al sinds CSS2 is de attribuut selector beschikbaar. De link die in een nieuw venster opent moet heeft een ander target dan de normale links. Wat je dus met Ã©Ã©n regeltje CSS kunt doen is de link aanspreken die een target op “_blank” heeft gezet.

```css
a[target="_blank"] {
  padding-right: 20px;
  background: url(new-window.png) no-repeat right center;
}
```

Nu is het plaatsen van een target lang niet altijd iets wat je wilt doen dus kun je je afvragen of er geen andere oplossing voor dit probleem is. En uiteraard is dat mogelijk, je kunt met CSS elk attribuut uitlezen, dus ook je href.

```css
a[href^="http://"] {
  padding-right: 20px;
  background: url(new-window.png) no-repeat right center;
}
```

Hier kijken we bij de eerste selector of de href de term “http://” bevat, en we gaan er dan van uit dat deze links daardoor dus naar een andere site gaan want we tonen weer het icoontje.
Om dit gedrag ongedaan te maken willen we natuurlijk wel dat het voor interne links (mocht je voor SEO doeleinden je complete domeinnaam in de link hebben staan, en dus geen relatieve links gebruiken) weer ongedaan wordt gemaakt.

```css
a[href^="http://www.lucraak.nl"] {
  padding-right: 0px;
  background: none;
}
```

Tot slot kunnen we met de komst van CSS3 nog iets veel interessanters doen. We kunnen onderdelen van strings matchen in onze selector. Zojuist hebben we het begin van het href attribuut string gematched met “http://” maar je kunt ook je gebruikers laten weten naar welk type document gaat met behulp van het $ teken in de selector. Stel je voor dat je alle pdf documenten in de lopende tekst wilt laten zien aan je gebruikers.

```html
<a href="document.pdf">Link naar pdf document</a>
```

Met de volgende regel CSS kun je deze link voorzien van een pdf icoontje.

```css
a[href$=".pdf"] {
  padding-right: 20px;
  background: url(pdf-icon.png) no-repeat right center;
}
```
Het dollarteken vergelijkt het laatste stuk van de href met de opgegeven waarde tussen de aanhalingstekens.
Door in de plek van het dollarteken een asterisk (*) in te vullen wordt er gekeken of er op een willekeurige plek in de href deze tekens voorkomen. Zo kun je bijvoorbeeld trefwoorden in omschrijvingen die in het title attribuut staan duidelijk maken. Stel dat je in het title attribuut van een afbeelding de namen van de mensen die op een foto staan neerzet. Door te vergelijken met de naam Pietje kun je de afbeeldingen met Pietje op een andere manier weergeven dan een willekeurige andere afbeelding. Bijvoorbeeld door de hoogte en breedte van de afbeelding aan te passen. In dit voorbeeld hoeft de tekst “Pietje” dus niet voor- of achteraan in het attribuut te staan. Als “Pietje en Jantje bij een waterval”, “Jantje zit bij Pietje op de rug” en “Pietjes auto” in het title attribuut staan zullen deze afbeeldingen worden gevangen door deze selector.

img[title*="Pietje"] {
  width: 300px;
  height: 300px;
}
Soms wil je niet dat de mensen direct zien dat het een pdf document is omdat het visueel misschien afleidt in de lopende tekst, in dat geval kun je ook on demand dit duidelijk maken, wanneer bijvoorbeeld je gebruiker met de muis over je link gaat kun je laten zien dat ze te maken gaan krijgen met een pdf document in plaats van een html document. Deze metadata is dus “verstopt” achter de link en komt tevoorschijn wanneer de gebruiker met de muis op de link gaat staan. Met behulp van “generated content” kunnen we onze metada weergeven zoals we willen. Daarover in een ander artikel meer.

Conclusie
Met de huidige attribuut selectoren kun je bezoekers van je site bedienen op veel meer manieren dan je in eerste instantie misschien zou denken. Het tonen van metadata op basis van het type informatie waar je de gebruiker heen stuurt kan helpen om de gebruiker een goed gevoel over te laten houden aan het bezoek op je site. Het visualiseren van deze metadata is natuurlijk nog wel een onderdeel waar men goed over na moet denken wil de metadata een toegevoegde waarde leveren. Tot slot wil ik nog melden dat de CSS3 selectors (en zelfs een boel CSS2.1 attribuut selectors) niet worden ondersteund door alle browsers (zoals Internet Explorer). Mocht je met deze groep gebruikers rekening willen houden, bedenk dan dat je deze informatie op een nette manier moet laten degraderen voor de incapabele browsers. In veel gevallen zal de selector gewoon niet worden uitgevoerd en zul je niet met dit probleem te maken krijgen. Wil je echter belangrijke informatie weergeven, zul je misschien een ander alternatief moeten bedenken voor het weergeven van deze informatie.