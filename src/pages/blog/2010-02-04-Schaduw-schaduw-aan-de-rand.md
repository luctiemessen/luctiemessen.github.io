---
layout: "../../layouts/BlogPostLayout.astro"
title: Schaduw schaduw aan de rand...
date: 2010-02-04 10:50:21
[//]: # format date like: yyyy-mm-dd
description: Een stukje over schaduw in CSS 3
tags: tags css
draft: false
dutch: yes
---

is article is written in Dutch.

Je kent het wel, je klanten willen mooie afgeronde hoekjes op de blokken op hun site. En als ze dan deze uitgewerkte ronde randen zien willen ze daar weer diepte in: “Ow kan er ook een schaduw achter?”. En dan mag je dat weer cross-browser compatible maken want het IE6 gebruikende webfossiel moet ook natuurlijk van die mooie randjes kunnen genietenâ€¦ *zucht*

Afhankelijk van hoe schaalbaar het blokje moet zijn moet je gebruik maken van allerlei interessante constructies (extra markup, meerdere achtergrondafbeeldingen (lees: http requests)).
Een tijdje terug kwam de grafisch ontwerper met een concept dat over de gehele site gebruikt moest worden, de ene keer moest het horizontaal meegroeien met de content, de andere keer verticaal.

Voorbeeld van boxjes
Afbeelding eindresultaat

Zie hieronder wat ik bedoel (links de neutrale status, en rechts de mouseover status).

Best geinig, er zit een schaduw achter het object en er zit ook een binnenschaduw in het object, gecombineerd levert dat best een leuk concept op. Zou het echter niet handig zijn als dit geneuzel met het slicen van afbeeldingen e.d. eens afgelopen kan zijn? Nou, dat kan.

Hieronder zal ik uitleggen hoe je met wat simpele CSS3 selectors dit kunt bereiken zonder gedoe met afbeeldingen, http requests, overbodige datatraffic en beperkte schaalbaarheid. Daarbij opent de nieuwe manier nog extra functionaliteit kunt toevoegen zoals animaties. Je levert wat in aan cross browser compatibiliteit maar goed, kom op, het is 2010 we kunnen wel zonder de IE’s.

Werkwijze
Om dit te bereiken heb je de volgende markup nodig.

<div class="attention">
  Let op! Deze box bestaat uit slechts Ã©Ã©n html element maar hij bevat meerdere schaduwen. Is dat niet dolletjes?
</div>
We willen de aandacht van de gebruiker trekken met dit elementje dus geven we hem de class “attention”.
Om als eerste een achtergrondschaduw op het blokje te zetten willen we met CSS3 een box-shadow toevoegen.

{% highlight css %}
.attention {
	width: 200px;
	padding: 20px;
	margin: 0 auto;
	-moz-box-shadow: 0 0 10px #ccc;
	-webkit-box-shadow: 0 0 10px #ccc;
	box-shadow: 0 0 10px #ccc;
}
{% endhighlight  %}

De box-shadow vraagt vier argumenten:

De lengte van de horizontale afstand van de schaduw t.o.v. de box. Een negatieve waarde zorgt er voor dat de schaduw links van de box komt te staan, een positieve brengt hem naar rechts.
De lengte van de verticale afstand van de schaduw t.o.v. de box. Een negatieve waarde zorgt voor een schaduw boven de box, een positieve brengt hem onder de box.
De blur radius van de schaduw, dit is dus de lengte waarover de schaduw zich moet uitspreiden.
De kleur van de schaduw
Het grappige is dat ja naast Ã©Ã©n schaduw, nog een andere schaduw kunt toevoegen gewoon door er een komma achter te zetten. Hoe handig is dat! Nu kunnen we ook de schaduw aan de binnenkant gaan zettenâ€¦ Dit doen we met een extra attribuut genaamd “inset”.

.attention {
width: 200px;
padding: 20px;
margin: 0 auto;
-moz-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-webkit-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
}
Deze inset schaduw is iets groter zodat we een vollere schaduw aan de binnenkant krijgen.

Zie hier het tussenresultaat.

Wat missen we nog?â€¦ Precies! Ronde hoekjes. Daar hebben we uiteraard de border-radius eigenschap voor. Laten we die even toevoegen.

.attention {
width: 200px;
padding: 20px;
margin: 0 auto;
-moz-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-webkit-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
border-radius: 10px;
}
We komen al in de buurt kijk maarâ€¦

Het enige wat we nu nog missen is een witte rand tussen de twee schaduwen, want ze liggen nu dicht op elkaar. Onze eeuwenoude eigenschap “border” gaat ons daar bij helpen.

We voegen een witte rand toe en we zijn klaar!

.attention {
width: 200px;
padding: 20px;
margin: 0 auto;
-moz-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-webkit-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
border-radius: 10px;
border: 2px solid #fff;
}
Twee pixeltjes afstand tussen beide schaduwen en we hebben ons gewenste resultaat. We hebben de afbeelding compleet nagemaakt zonder het gebruik van plaatjes. Maar zoals ik al aangaf in de introductie kunnen we nu meer doen met dit element.

Spice it up
De overgang op de mouseover is vrij abrupt, iets waar we aan gewend zijn geraakt omdat we met afbeeldingen niet anders konden (nouja, in theorie zou je geanimeerde gif’s kunnen gebruiken maar dat doen we niet toch…?). Met deze opzet kunnen we de overgang van neutrale status naar actieve status (mouseover) animeren. Dit kan door de transition eigenschap van CSS3 (box-shadow en border-radius zijn overigens ook allemaal CSS3 eigenschappen). Door een simpel regeltje toe te voegen animeert de overgang van neutraal naar actief vloeiend en zitten we niet meer in de maag gesplitst met de abrupte overgangen.

.attention {
width: 200px;
padding: 20px;
margin: 0 auto;
-moz-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-webkit-box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
box-shadow: 0 0 10px #ccc, inset 0 0 50px #ccc;
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
border-radius: 10px;
border: 2px solid #fff;
-webkit-transition: -webkit-box-shadow 0.6s;
-moz-transition: -moz-box-shadow 0.6s;
transition: box-shadow 0.6s;
}

.attention:hover {
-moz-box-shadow: 0 0 10px #666, inset 0 0 50px #666;
-webkit-box-shadow: 0 0 10px #666, inset 0 0 50px #666;
box-shadow: 0 0 10px #666, inset 0 0 50px #666;
}
We hebben nu de transition specifiek op de box-shadow gezet. Je zou deze ook op “all” kunnen zetten en dan worden alle ondersteunde eigenschappen binnen 0.6 seconden getransformeerd naar de doelvorm. Je kunt hiermee natuurlijk helemaal los gaan, het veranderen van de tekst kleur, de achtergrondkleur e.d. alles kan worden bepaald. Om het subtiel te houden laten we het bij de box-shadow die we transformeren.

Zie hier het eindresultaat.

Tot slot
Naast dat dit natuurlijk een handige en snelle methode is om de boel zonder afbeeldingen te realiseren moet je goed stilstaan bij het gebruik en je realiseren dat het niet door alle browsers wordt ondersteund. Wanneer de afscheiding van het blok een belangrijke functie heeft zoals het scheiden/uitlichten van proces gevoelige informatie dan is het verstandig om toch terug te vallen op de archaÃ¯sche methode met het gebruik van afbeeldingen. Is het niet belangrijk voor het proces of de flow van de pagina, gebruik dan lekker deze methode alle oude browsers negeren de CSS dan gewoon en krijgen een schaduwloos, ronderandjesloos en animatieloos bokje. Hier al weer drie redenen om met de tijd mee te gaan.

Met dank aan Cornelis die er voor gezorgd heeft dat dit artikel een keer volledig herschreven moest worden :)