'use strict';
const embeddedAlbanianWords={"3":["ajo","ata","ato","unë","dhe","por","ose","sot","dje","ujë","det","mal","mik","gur","bar","yll","shi","dua","kam","jam","fle","eci","vij","rri","hap","qen","zog","çaj","orë","keq","një","tre","kur","pse"],"4":["tani","blej","pres","baba","nënë","mike","mace","kalë","bukë","kafe","vezë","mish","oriz","supë","ditë","natë","kohë","mirë","afër","larg","këtu","atje","emër","dorë","kokë","gojë","punë","park","grua","shoh","marr","them","pyes","mund","derë","borë","mjek","flas","pesë","tetë","kush"],"5":["rrugë","hotel","qytet","fshat","dyqan","libër","çelës","çantë","mollë","kripë","zemër","vëlla","motër","djalë","vajzë","burrë","shkoj","punoj","mësoj","lexoj","mbyll","duhet","dhomë","peshk","diell","qiell","shqip","gjuhë","fjalë","fjali","banjë","katër","nëntë","çfarë"],"6":["dëgjoj","shtëpi","makinë","biletë","djathë","banane","sheqer","mjaltë","ftohtë","bardhë","verdhë","ndihmë","doktor","spital","fëmijë","kopsht","krevat","kuptoj","gatuaj","vrapoj","shtatë","dhjetë"],"7":["telefon","qumësht","ngrohtë","gjelbër","farmaci","stacion","shkollë","familje","kuzhinë","dritare","karrige","autobus","mëngjes","mbrëmje","shëndet","shkruaj","gjashtë"]};
const embeddedAlbanianTranslations={"ai":"hij","ajo":"zij","ata":"zij","ato":"zij","unë":"ik","ti":"jij","ne":"wij","ju":"jullie / u","po":"ja","jo":"nee","dhe":"en","por":"maar","ose":"of","sot":"vandaag","dje":"gisteren","tani":"nu","ujë":"water","det":"zee","mal":"berg","mik":"vriend","gur":"steen","bar":"gras","yll":"ster","shi":"regen","dua":"ik wil","kam":"ik heb","jam":"ik ben","di":"ik weet","ha":"ik eet","pi":"ik drink","fle":"ik slaap","eci":"ik loop","vij":"ik kom","rri":"ik blijf","blej":"ik koop","pres":"ik wacht","hap":"ik open","baba":"vader","nënë":"moeder","mike":"vriendin","mace":"kat","qen":"hond","zog":"vogel","kalë":"paard","bukë":"brood","kafe":"koffie","çaj":"thee","vezë":"ei","mish":"vlees","oriz":"rijst","supë":"soep","ditë":"dag","natë":"nacht","kohë":"tijd","orë":"uur","mirë":"goed","keq":"slecht","afër":"dichtbij","larg":"ver","këtu":"hier","atje":"daar","emër":"naam","dorë":"hand","kokë":"hoofd","gojë":"mond","rrugë":"straat","punë":"werk","park":"park","hotel":"hotel","qytet":"stad","fshat":"dorp","dyqan":"winkel","libër":"boek","çelës":"sleutel","çantë":"tas","mollë":"appel","kripë":"zout","zemër":"hart","vëlla":"broer","motër":"zus","djalë":"jongen","vajzë":"meisje","burrë":"man","grua":"vrouw","shkoj":"ik ga","punoj":"ik werk","mësoj":"ik leer","lexoj":"ik lees","dëgjoj":"ik luister","shoh":"ik zie","mbyll":"ik sluit","marr":"ik neem","them":"ik zeg","pyes":"ik vraag","mund":"kan","duhet":"moet","shtëpi":"huis","dhomë":"kamer","derë":"deur","makinë":"auto","telefon":"telefoon","biletë":"kaartje","peshk":"vis","djathë":"kaas","banane":"banaan","sheqer":"suiker","mjaltë":"honing","qumësht":"melk","diell":"zon","borë":"sneeuw","qiell":"lucht","ftohtë":"koud","ngrohtë":"warm","bardhë":"wit","gjelbër":"groen","verdhë":"geel","shqip":"Albanees","gjuhë":"taal","fjalë":"woord","fjali":"zin","ndihmë":"hulp","doktor":"dokter","mjek":"arts","spital":"ziekenhuis","farmaci":"apotheek","stacion":"station","shkollë":"school","fëmijë":"kind","familje":"familie","kopsht":"tuin","kuzhinë":"keuken","banjë":"badkamer","dritare":"raam","karrige":"stoel","krevat":"bed","tavolinë":"tafel","aeroport":"luchthaven","autobus":"bus","biçikletë":"fiets","restorant":"restaurant","mëngjes":"ochtend / ontbijt","mbrëmje":"avond","shëndet":"gezondheid","shkruaj":"ik schrijf","kuptoj":"ik begrijp","flas":"ik spreek","gatuaj":"ik kook","vrapoj":"ik ren","një":"één","dy":"twee","tre":"drie","katër":"vier","pesë":"vijf","gjashtë":"zes","shtatë":"zeven","tetë":"acht","nëntë":"negen","dhjetë":"tien","kush":"wie","çfarë":"wat","ku":"waar","kur":"wanneer","pse":"waarom","si":"hoe","sa":"hoeveel"};
const sentenceData=[{"ru":"Përshëndetje!","nl":"Hallo!"},{"ru":"Mirëmëngjes!","nl":"Goedemorgen!"},{"ru":"Mirëdita!","nl":"Goedendag!"},{"ru":"Mirëmbrëma!","nl":"Goedenavond!"},{"ru":"Mirupafshim!","nl":"Tot ziens!"},{"ru":"Faleminderit!","nl":"Dank je!"},{"ru":"Ju lutem.","nl":"Alstublieft."},{"ru":"Më fal.","nl":"Sorry."},{"ru":"Si je?","nl":"Hoe gaat het?"},{"ru":"Jam mirë.","nl":"Het gaat goed."},{"ru":"Si quhesh?","nl":"Hoe heet je?"},{"ru":"Nuk kuptoj.","nl":"Ik begrijp het niet."},{"ru":"E kuptoj.","nl":"Ik begrijp het."},{"ru":"Nuk e di.","nl":"Ik weet het niet."},{"ru":"Ku është tualeti?","nl":"Waar is het toilet?"},{"ru":"Sa kushton kjo?","nl":"Hoeveel kost dit?"},{"ru":"Më duhet ndihmë.","nl":"Ik heb hulp nodig."},{"ru":"Unë flas shqip.","nl":"Ik spreek Albanees."},{"ru":"Unë jam nga Holanda.","nl":"Ik kom uit Nederland."},{"ru":"Kjo është nëna.","nl":"Dit is moeder."},{"ru":"Ky është babai.","nl":"Dit is vader."},{"ru":"Ky është vëllai.","nl":"Dit is broer."},{"ru":"Kjo është motra.","nl":"Dit is zus."},{"ru":"Kam një shtëpi.","nl":"Ik heb een huis."},{"ru":"Kam një makinë.","nl":"Ik heb een auto."},{"ru":"Kam një telefon.","nl":"Ik heb een telefoon."},{"ru":"Kam një libër.","nl":"Ik heb een boek."},{"ru":"Kam një mace.","nl":"Ik heb een kat."},{"ru":"Kam një qen.","nl":"Ik heb een hond."},{"ru":"Dua ujë.","nl":"Ik wil water."},{"ru":"Dua çaj.","nl":"Ik wil thee."},{"ru":"Dua kafe.","nl":"Ik wil koffie."},{"ru":"Dua bukë.","nl":"Ik wil brood."},{"ru":"Dua të ha.","nl":"Ik wil eten."},{"ru":"Dua të pi.","nl":"Ik wil drinken."},{"ru":"Unë ha bukë.","nl":"Ik eet brood."},{"ru":"Unë ha supë.","nl":"Ik eet soep."},{"ru":"Unë ha oriz.","nl":"Ik eet rijst."},{"ru":"Unë pi ujë.","nl":"Ik drink water."},{"ru":"Unë pi çaj.","nl":"Ik drink thee."},{"ru":"Unë pi kafe.","nl":"Ik drink koffie."},{"ru":"Jam në shtëpi.","nl":"Ik ben thuis."},{"ru":"Jam në punë.","nl":"Ik ben op het werk."},{"ru":"Jam në shkollë.","nl":"Ik ben op school."},{"ru":"Jam në dyqan.","nl":"Ik ben in de winkel."},{"ru":"Jam në hotel.","nl":"Ik ben in het hotel."},{"ru":"Shkoj në shtëpi.","nl":"Ik ga naar huis."},{"ru":"Shkoj në punë.","nl":"Ik ga naar het werk."},{"ru":"Shkoj në shkollë.","nl":"Ik ga naar school."},{"ru":"Unë punoj.","nl":"Ik werk."},{"ru":"Unë mësoj.","nl":"Ik leer."},{"ru":"Unë lexoj.","nl":"Ik lees."},{"ru":"Unë shkruaj.","nl":"Ik schrijf."},{"ru":"Unë fle.","nl":"Ik slaap."},{"ru":"Sot është ngrohtë.","nl":"Vandaag is het warm."},{"ru":"Sot është ftohtë.","nl":"Vandaag is het koud."},{"ru":"Sot bie shi.","nl":"Vandaag regent het."},{"ru":"Tani është mëngjes.","nl":"Het is nu ochtend."},{"ru":"Tani është mbrëmje.","nl":"Het is nu avond."},{"ru":"Jam i lodhur.","nl":"Ik ben moe."},{"ru":"Kjo është shtëpi.","nl":"Dit is een huis."},{"ru":"Kjo është makinë.","nl":"Dit is een auto."},{"ru":"Ky është libër.","nl":"Dit is een boek."},{"ru":"Kjo është derë.","nl":"Dit is een deur."},{"ru":"Kjo është dritare.","nl":"Dit is een raam."},{"ru":"Kjo është shkollë.","nl":"Dit is een school."},{"ru":"Uji është i ftohtë.","nl":"Het water is koud."},{"ru":"Bora është e bardhë.","nl":"Sneeuw is wit."},{"ru":"Qielli është blu.","nl":"De lucht is blauw."},{"ru":"Keni ujë?","nl":"Heeft u water?"},{"ru":"Keni kafe?","nl":"Heeft u koffie?"},{"ru":"Një kafe, ju lutem.","nl":"Eén koffie alstublieft."},{"ru":"Faturën, ju lutem.","nl":"De rekening alstublieft."},{"ru":"Ku është stacioni?","nl":"Waar is het station?"},{"ru":"Ku është hoteli?","nl":"Waar is het hotel?"},{"ru":"Ku është farmacia?","nl":"Waar is de apotheek?"},{"ru":"Shkoni drejt.","nl":"Ga rechtdoor."},{"ru":"Kthehuni majtas.","nl":"Sla linksaf."},{"ru":"Kthehuni djathtas.","nl":"Sla rechtsaf."},{"ru":"Është larg?","nl":"Is het ver?"},{"ru":"Është afër?","nl":"Is het dichtbij?"},{"ru":"Unë ha mish.","nl":"Ik eet vlees."},{"ru":"Dua mish.","nl":"Ik wil vlees."},{"ru":"Unë ha peshk.","nl":"Ik eet vis."},{"ru":"Dua peshk.","nl":"Ik wil vis."},{"ru":"Unë ha djathë.","nl":"Ik eet kaas."},{"ru":"Dua djathë.","nl":"Ik wil kaas."},{"ru":"Unë ha mollë.","nl":"Ik eet een appel."},{"ru":"Dua mollë.","nl":"Ik wil een appel."},{"ru":"Unë ha banane.","nl":"Ik eet een banaan."},{"ru":"Dua banane.","nl":"Ik wil een banaan."},{"ru":"Unë pi qumësht.","nl":"Ik drink melk."},{"ru":"Dua qumësht.","nl":"Ik wil melk."},{"ru":"Ku është shtëpia?","nl":"Waar is het huis?"},{"ru":"Ku është makina?","nl":"Waar is de auto?"},{"ru":"Ku është telefoni?","nl":"Waar is de telefoon?"},{"ru":"Ku është libri?","nl":"Waar is het boek?"},{"ru":"Ku është çelësi?","nl":"Waar is de sleutel?"},{"ru":"Ku është çanta?","nl":"Waar is de tas?"},{"ru":"Numri është një.","nl":"Het getal is één."},{"ru":"Numri është dy.","nl":"Het getal is twee."},{"ru":"Numri është tre.","nl":"Het getal is drie."},{"ru":"Numri është katër.","nl":"Het getal is vier."},{"ru":"Numri është pesë.","nl":"Het getal is vijf."},{"ru":"Numri është gjashtë.","nl":"Het getal is zes."},{"ru":"Numri është shtatë.","nl":"Het getal is zeven."},{"ru":"Numri është tetë.","nl":"Het getal is acht."},{"ru":"Numri është nëntë.","nl":"Het getal is negen."},{"ru":"Numri është dhjetë.","nl":"Het getal is tien."},{"ru":"Unë jam në shtëpi.","nl":"Ik ben thuis."},{"ru":"Unë jam në park.","nl":"Ik ben in het park."},{"ru":"Unë jam në qytet.","nl":"Ik ben in de stad."},{"ru":"Unë jam në hotel.","nl":"Ik ben in het hotel."},{"ru":"Unë jam në dyqan.","nl":"Ik ben in de winkel."},{"ru":"Si jeni?","nl":"Hoe gaat het met u?"},{"ru":"Jam shumë mirë.","nl":"Het gaat heel goed."},{"ru":"Po ti?","nl":"En jij?"},{"ru":"Po ju?","nl":"En u?"},{"ru":"Quhem Ana.","nl":"Ik heet Ana."},{"ru":"Nga jeni?","nl":"Waar komt u vandaan?"},{"ru":"Jam nga Shqipëria.","nl":"Ik kom uit Albanië."},{"ru":"Jetoj në Holandë.","nl":"Ik woon in Nederland."},{"ru":"Flas pak shqip.","nl":"Ik spreek een beetje Albanees."},{"ru":"Flas holandisht.","nl":"Ik spreek Nederlands."},{"ru":"A flisni anglisht?","nl":"Spreekt u Engels?"},{"ru":"Përsëriteni, ju lutem.","nl":"Herhaal het alstublieft."},{"ru":"Më ndihmoni, ju lutem.","nl":"Help mij alstublieft."},{"ru":"Çfarë do të thotë?","nl":"Wat betekent dat?"},{"ru":"Si thuhet në shqip?","nl":"Hoe zeg je dat in het Albanees?"},{"ru":"Nuk flas mirë shqip.","nl":"Ik spreek niet goed Albanees."},{"ru":"Po mësoj shqip.","nl":"Ik leer Albanees."},{"ru":"Lexoj një libër.","nl":"Ik lees een boek."},{"ru":"Shkruaj një mesazh.","nl":"Ik schrijf een bericht."},{"ru":"Dëgjoj muzikë.","nl":"Ik luister naar muziek."},{"ru":"Shikoj televizor.","nl":"Ik kijk televisie."},{"ru":"Hap derën.","nl":"Ik open de deur."},{"ru":"Mbyll derën.","nl":"Ik sluit de deur."},{"ru":"Hap dritaren.","nl":"Ik open het raam."},{"ru":"Mbyll dritaren.","nl":"Ik sluit het raam."},{"ru":"Ulu këtu.","nl":"Ga hier zitten."},{"ru":"Eja këtu.","nl":"Kom hier."},{"ru":"Prit pak.","nl":"Wacht even."},{"ru":"Shkoj tani.","nl":"Ik ga nu."},{"ru":"Vij nesër.","nl":"Ik kom morgen."},{"ru":"Shihemi nesër.","nl":"Tot morgen."},{"ru":"Shihemi më vonë.","nl":"Tot later."},{"ru":"Çfarë ore është?","nl":"Hoe laat is het?"},{"ru":"Është ora një.","nl":"Het is één uur."},{"ru":"Është ora dy.","nl":"Het is twee uur."},{"ru":"Është herët.","nl":"Het is vroeg."},{"ru":"Është vonë.","nl":"Het is laat."},{"ru":"Sot është e hënë.","nl":"Vandaag is het maandag."},{"ru":"Sot është e martë.","nl":"Vandaag is het dinsdag."},{"ru":"Sot është e mërkurë.","nl":"Vandaag is het woensdag."},{"ru":"Sot është e enjte.","nl":"Vandaag is het donderdag."},{"ru":"Sot është e premte.","nl":"Vandaag is het vrijdag."},{"ru":"Sot është e shtunë.","nl":"Vandaag is het zaterdag."},{"ru":"Sot është e diel.","nl":"Vandaag is het zondag."},{"ru":"Kam uri.","nl":"Ik heb honger."},{"ru":"Kam etje.","nl":"Ik heb dorst."},{"ru":"Jam e lodhur.","nl":"Ik ben moe."},{"ru":"Jam i lumtur.","nl":"Ik ben blij."},{"ru":"Jam e lumtur.","nl":"Ik ben blij."},{"ru":"Ndihem mirë.","nl":"Ik voel me goed."},{"ru":"Ndihem keq.","nl":"Ik voel me slecht."},{"ru":"Më dhemb koka.","nl":"Ik heb hoofdpijn."},{"ru":"Kam nevojë për mjek.","nl":"Ik heb een dokter nodig."},{"ru":"Ku është spitali?","nl":"Waar is het ziekenhuis?"},{"ru":"Telefononi mjekun.","nl":"Bel de dokter."},{"ru":"Dua një ujë.","nl":"Ik wil een water."},{"ru":"Dua një çaj.","nl":"Ik wil een thee."},{"ru":"Dua një kafe.","nl":"Ik wil een koffie."},{"ru":"Dua një birrë.","nl":"Ik wil een bier."},{"ru":"Pa sheqer, ju lutem.","nl":"Zonder suiker alstublieft."},{"ru":"Me qumësht, ju lutem.","nl":"Met melk alstublieft."},{"ru":"Çfarë keni për të ngrënë?","nl":"Wat heeft u te eten?"},{"ru":"Dua mëngjes.","nl":"Ik wil ontbijt."},{"ru":"Dua drekë.","nl":"Ik wil lunch."},{"ru":"Dua darkë.","nl":"Ik wil avondeten."},{"ru":"Më pëlqen kjo.","nl":"Ik vind dit lekker."},{"ru":"Nuk më pëlqen kjo.","nl":"Ik vind dit niet lekker."},{"ru":"Është shumë e mirë.","nl":"Het is erg lekker."},{"ru":"Një tavolinë për dy.","nl":"Een tafel voor twee."},{"ru":"Menunë, ju lutem.","nl":"Het menu alstublieft."},{"ru":"A mund të paguaj?","nl":"Kan ik betalen?"},{"ru":"Paguaj me kartë.","nl":"Ik betaal met kaart."},{"ru":"Paguaj me para.","nl":"Ik betaal contant."},{"ru":"Sa kushton?","nl":"Hoeveel kost het?"},{"ru":"Është shumë shtrenjtë.","nl":"Het is erg duur."},{"ru":"A keni më lirë?","nl":"Heeft u iets goedkopers?"},{"ru":"Dua ta blej.","nl":"Ik wil het kopen."},{"ru":"Vetëm po shikoj.","nl":"Ik kijk alleen even."},{"ru":"Keni këtë madhësi?","nl":"Heeft u deze maat?"},{"ru":"Ku është supermarketi?","nl":"Waar is de supermarkt?"},{"ru":"Ku është qendra?","nl":"Waar is het centrum?"},{"ru":"Ku është banka?","nl":"Waar is de bank?"},{"ru":"Ku është posta?","nl":"Waar is het postkantoor?"},{"ru":"Ku është aeroporti?","nl":"Waar is de luchthaven?"},{"ru":"Ku është plazhi?","nl":"Waar is het strand?"},{"ru":"Është këtu afër.","nl":"Het is hier dichtbij."},{"ru":"Është shumë larg.","nl":"Het is erg ver."},{"ru":"Në të majtë.","nl":"Aan de linkerkant."},{"ru":"Në të djathtë.","nl":"Aan de rechterkant."},{"ru":"Përballë hotelit.","nl":"Tegenover het hotel."},{"ru":"Pranë stacionit.","nl":"Naast het station."},{"ru":"Pas bankës.","nl":"Achter de bank."},{"ru":"Para shkollës.","nl":"Voor de school."},{"ru":"Dua një biletë.","nl":"Ik wil een kaartje."},{"ru":"Një biletë për Tiranë.","nl":"Een kaartje naar Tirana."},{"ru":"Kur niset autobusi?","nl":"Wanneer vertrekt de bus?"},{"ru":"Kur vjen treni?","nl":"Wanneer komt de trein?"},{"ru":"Ku ndalon autobusi?","nl":"Waar stopt de bus?"},{"ru":"Ky autobus shkon në qendër.","nl":"Deze bus gaat naar het centrum."},{"ru":"A është ky vend i lirë?","nl":"Is deze plaats vrij?"},{"ru":"Dua një taksi.","nl":"Ik wil een taxi."},{"ru":"Më çoni në hotel.","nl":"Breng mij naar het hotel."},{"ru":"Ndaloni këtu, ju lutem.","nl":"Stop hier alstublieft."},{"ru":"Kam një rezervim.","nl":"Ik heb een reservering."},{"ru":"Kam rezervuar një dhomë.","nl":"Ik heb een kamer gereserveerd."},{"ru":"Dua një dhomë.","nl":"Ik wil een kamer."},{"ru":"Për një natë.","nl":"Voor één nacht."},{"ru":"Për dy net.","nl":"Voor twee nachten."},{"ru":"A ka mëngjes?","nl":"Is er ontbijt?"},{"ru":"Ku është dhoma ime?","nl":"Waar is mijn kamer?"},{"ru":"Çelësi, ju lutem.","nl":"De sleutel alstublieft."},{"ru":"Ka internet?","nl":"Is er internet?"},{"ru":"Ka Wi-Fi?","nl":"Is er wifi?"},{"ru":"Fjalëkalimi, ju lutem.","nl":"Het wachtwoord alstublieft."},{"ru":"Dhoma është e pastër.","nl":"De kamer is schoon."},{"ru":"Dhoma është e vogël.","nl":"De kamer is klein."},{"ru":"Dhoma është e madhe.","nl":"De kamer is groot."},{"ru":"Kam një problem.","nl":"Ik heb een probleem."},{"ru":"Dushi nuk punon.","nl":"De douche werkt niet."},{"ru":"Drita nuk punon.","nl":"Het licht werkt niet."},{"ru":"Më duhet një peshqir.","nl":"Ik heb een handdoek nodig."},{"ru":"Sot ka diell.","nl":"Vandaag schijnt de zon."},{"ru":"Po bie borë.","nl":"Het sneeuwt."},{"ru":"Ka shumë erë.","nl":"Er staat veel wind."},{"ru":"Është shumë ngrohtë.","nl":"Het is erg warm."},{"ru":"Është shumë ftohtë.","nl":"Het is erg koud."},{"ru":"Moti është i mirë.","nl":"Het weer is goed."},{"ru":"Moti është i keq.","nl":"Het weer is slecht."},{"ru":"Kjo është familja ime.","nl":"Dit is mijn familie."},{"ru":"Ky është burri im.","nl":"Dit is mijn man."},{"ru":"Kjo është gruaja ime.","nl":"Dit is mijn vrouw."},{"ru":"Ky është djali im.","nl":"Dit is mijn zoon."},{"ru":"Kjo është vajza ime.","nl":"Dit is mijn dochter."},{"ru":"Kam dy fëmijë.","nl":"Ik heb twee kinderen."},{"ru":"Kam një vëlla.","nl":"Ik heb een broer."},{"ru":"Kam një motër.","nl":"Ik heb een zus."},{"ru":"Nëna ime është këtu.","nl":"Mijn moeder is hier."},{"ru":"Babai im është atje.","nl":"Mijn vader is daar."},{"ru":"Shtëpia ime është këtu.","nl":"Mijn huis is hier."},{"ru":"Makina ime është jashtë.","nl":"Mijn auto staat buiten."},{"ru":"Telefoni është në tavolinë.","nl":"De telefoon ligt op tafel."},{"ru":"Çelësi është në çantë.","nl":"De sleutel zit in de tas."},{"ru":"Libri është në dhomë.","nl":"Het boek ligt in de kamer."},{"ru":"Qeni është në kopsht.","nl":"De hond is in de tuin."},{"ru":"Macja është në shtëpi.","nl":"De kat is in huis."},{"ru":"Dera është e hapur.","nl":"De deur is open."},{"ru":"Dera është e mbyllur.","nl":"De deur is dicht."},{"ru":"Dritarja është e hapur.","nl":"Het raam is open."},{"ru":"Dritarja është e mbyllur.","nl":"Het raam is dicht."},{"ru":"Dua të punoj.","nl":"Ik wil werken."},{"ru":"Dua të mësoj.","nl":"Ik wil leren."},{"ru":"Dua të lexoj.","nl":"Ik wil lezen."},{"ru":"Dua të fle.","nl":"Ik wil slapen."},{"ru":"Mund të hyj?","nl":"Mag ik binnenkomen?"},{"ru":"Mund të ulem?","nl":"Mag ik zitten?"},{"ru":"Mund të ndihmoj?","nl":"Kan ik helpen?"},{"ru":"Mund të pres këtu?","nl":"Kan ik hier wachten?"},{"ru":"Duhet të shkoj.","nl":"Ik moet gaan."},{"ru":"Duhet të punoj.","nl":"Ik moet werken."},{"ru":"Duhet të pres.","nl":"Ik moet wachten."},{"ru":"Nuk mundem.","nl":"Ik kan niet."},{"ru":"Mundem.","nl":"Ik kan het."},{"ru":"E dua këtë.","nl":"Ik wil deze."},{"ru":"Nuk e dua këtë.","nl":"Ik wil deze niet."},{"ru":"Më jepni këtë.","nl":"Geef mij deze alstublieft."},{"ru":"Më jepni ujë.","nl":"Geef mij water alstublieft."},{"ru":"A është e lirë?","nl":"Is het goedkoop?"},{"ru":"A është e hapur?","nl":"Is het open?"},{"ru":"A është e mbyllur?","nl":"Is het gesloten?"},{"ru":"A është mirë?","nl":"Is het goed?"},{"ru":"A është gati?","nl":"Is het klaar?"},{"ru":"Jam gati.","nl":"Ik ben klaar."},{"ru":"Një moment, ju lutem.","nl":"Een moment alstublieft."},{"ru":"Nuk ka problem.","nl":"Geen probleem."},{"ru":"Gjithçka është mirë.","nl":"Alles is goed."},{"ru":"Shumë mirë.","nl":"Heel goed."},{"ru":"Në rregull.","nl":"In orde."},{"ru":"Sigurisht.","nl":"Natuurlijk."},{"ru":"Ndoshta.","nl":"Misschien."},{"ru":"Nuk ka rëndësi.","nl":"Het maakt niet uit."},{"ru":"Urime!","nl":"Gefeliciteerd!"},{"ru":"Gëzuar!","nl":"Proost!"},{"ru":"Mirë se vini!","nl":"Welkom!"},{"ru":"Udhëtim të mbarë!","nl":"Goede reis!"},{"ru":"Ditë të mbarë!","nl":"Fijne dag!"},{"ru":"Natën e mirë!","nl":"Welterusten!"}];

const lengths = [3, 4, 5, 6, 7];
const alphabet = ['a','b','c','ç','d','dh','e','ë','f','g','gj','h','i','j','k','l','ll','m','n','nj','o','p','q','r','rr','s','sh','t','th','u','v','x','xh','y','z','zh'];
const byId = id => document.getElementById(id);
const states = {
  letters: { current: [], search: false, target: null, last: null, translate: false, pending: false },
  words: { current: [], search: false, target: null, last: null, translate: false, pending: false },
  sentences: { current: [], search: false, target: null, last: null, translate: false, pending: false }
};
const ui = {
  letters: { prefix:'letters', grid:'lettersGrid', hint:'lettersHint', normal:'Tik op een letter om hem 3× te horen.', noun:'letter', article:'de juiste' },
  words: { prefix:'word', grid:'wordGrid', hint:'wordHint', normal:'Tik op een woord om het 3× te horen.', noun:'woord', article:'het juiste' },
  sentences: { prefix:'sentence', grid:'sentenceGrid', hint:'sentenceHint', normal:'Tik op een zin om hem woord voor woord te horen.', noun:'zin', article:'de juiste' }
};
let wordData = embeddedAlbanianWords;
let translations = { ...embeddedAlbanianTranslations };
let wordDataLoaded = false;
let wordDataPromise = null;
let currentLen = 3;
let audioMap = null;
let audioMapPromise = null;
let normalizedAudio = new Map();
let neuralVoice = 'anila';
try {
  const saved = localStorage.getItem('albanianNeuralVoiceV1');
  if (saved === 'anila' || saved === 'ilir') neuralVoice = saved;
} catch (_) { /* Storage can be unavailable; playback does not depend on it. */ }

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function textOf(kind, value) { return kind === 'sentences' ? value.ru : value; }
function hint(kind, text) { byId(ui[kind].hint).textContent = text; }
function audioKey(text) { return String(text).normalize('NFC').toLocaleLowerCase('sq-AL'); }
async function ensureWordData() {
  if (wordDataLoaded) return true;
  if (wordDataPromise) return wordDataPromise;
  wordDataPromise = (async () => {
    try {
      const response = await fetch('./word-data-750.json');
      if (!response.ok) throw new Error('Woordenlijst niet beschikbaar');
      const data = await response.json();
      if (!lengths.every(n => Array.isArray(data.words?.[n]) && data.words[n].length >= 12 && data.words[n].every(w => typeof w === 'string'))) throw new Error('Ongeldige woordenlijst');
      wordData = data.words;
      translations = { ...embeddedAlbanianTranslations, ...(data.translations || {}) };
      wordDataLoaded = true;
      const count = lengths.reduce((sum, n) => sum + wordData[n].length, 0);
      byId('dataStatus').textContent = count + ' frequente Albanese woorden gereed';
    } catch (_) {
      byId('dataStatus').textContent = 'Reservewoordenlijst geladen — volledige lijst niet beschikbaar.';
    } finally { wordDataPromise = null; }
    return true;
  })();
  return wordDataPromise;
}
async function ensureAudioMap() {
  if (audioMap) return audioMap;
  if (audioMapPromise) return audioMapPromise;
  audioMapPromise = (async () => {
    try {
      const response = await fetch('./audio-map.json');
      if (!response.ok) throw new Error('Audiolijst niet beschikbaar');
      const map = await response.json();
      if (!map.files || typeof map.files !== 'object') throw new Error('Ongeldige audiolijst');
      audioMap = map;
      normalizedAudio = new Map();
      for (const [key, entry] of Object.entries(map.files)) {
        const normalized = audioKey(key);
        if (!normalizedAudio.has(normalized)) normalizedAudio.set(normalized, entry);
      }
    } catch (_) { audioMap = null; }
    finally { audioMapPromise = null; }
    return audioMap;
  })();
  return audioMapPromise;
}
function findAudioEntry(map, text) {
  if (!map) return null;
  return map.files[text] || map.files[text.normalize('NFC')] || normalizedAudio.get(audioKey(text)) || null;
}

// One operation id owns every awaited delay and every audio callback.
// Cancelling resolves pending promises as false instead of leaving old loops alive.
const speechAudio = document.createElement('audio');
speechAudio.preload = 'auto';
speechAudio.setAttribute('playsinline', '');
speechAudio.setAttribute('webkit-playsinline', '');
document.body.appendChild(speechAudio);
let operationId = 0;
let cancelPlayback = null;
const pendingDelays = new Set();
function isCurrent(run) { return run === operationId; }
function stopAudio() {
  if (cancelPlayback) cancelPlayback();
  speechAudio.pause();
  try { speechAudio.currentTime = 0; } catch (_) {}
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  for (const id of ['goodSound', 'badSound']) {
    const audio = byId(id);
    audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
  }
}
function clearMarks(kind) {
  byId(ui[kind].grid).querySelectorAll('button').forEach(button => button.classList.remove('active', 'correct', 'wrong'));
}
function hideSentenceFocus() {
  byId('sentenceStage').classList.remove('has-focus');
  byId('sentenceFocus').classList.remove('show', 'full');
  byId('sentenceFocus').firstElementChild.textContent = '';
  scheduleFit();
}
function beginOperation() {
  operationId++;
  stopAudio();
  for (const pending of [...pendingDelays]) pending.cancel();
  for (const kind of Object.keys(states)) { states[kind].pending = false; clearMarks(kind); }
  hideSentenceFocus();
  return operationId;
}
function pauseFor(ms, run) {
  if (!isCurrent(run)) return Promise.resolve(false);
  return new Promise(resolve => {
    const pending = { cancel: null };
    const done = result => { clearTimeout(timer); pendingDelays.delete(pending); resolve(result); };
    const timer = setTimeout(() => done(isCurrent(run)), ms);
    pending.cancel = () => done(false);
    pendingDelays.add(pending);
  });
}
function audioError(kind, text) {
  if (kind) hint(kind, text);
  else byId('dataStatus').textContent = text;
}
async function playMapped(text, run, kind) {
  const map = await ensureAudioMap();
  if (!isCurrent(run)) return false;
  const entry = findAudioEntry(map, text);
  const relativePath = entry?.[neuralVoice];
  if (!relativePath) { audioError(kind, 'Audio ontbreekt voor: ' + text); return false; }
  if (cancelPlayback) cancelPlayback();
  return new Promise(resolve => {
    let finished = false;
    const finish = ok => {
      if (finished) return;
      finished = true;
      if (cancelPlayback === cancel) {
        cancelPlayback = null;
        speechAudio.onended = null;
        speechAudio.onerror = null;
      }
      resolve(ok && isCurrent(run));
    };
    const cancel = () => { speechAudio.pause(); finish(false); };
    cancelPlayback = cancel;
    speechAudio.onended = () => finish(true);
    const failed = () => {
      if (isCurrent(run) && !finished) audioError(kind, 'Audiobestand kan niet worden afgespeeld: ' + text);
      finish(false);
    };
    speechAudio.onerror = failed;
    speechAudio.src = new URL(relativePath, document.baseURI).href;
    speechAudio.muted = false;
    try {
      const promise = speechAudio.play();
      if (promise) promise.catch(failed);
    } catch (_) { failed(); }
  });
}
function playSound(id) {
  for (const other of ['goodSound', 'badSound']) {
    const audio = byId(other); audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
  }
  const result = byId(id).play();
  if (result) result.catch(() => { /* Correct/wrong marks remain available without sound. */ });
}
// The first user gesture primes the same element used for all subsequent clips.
// A delayed unlock callback must never pause a newly started exercise.
function unlockAudio() {
  document.removeEventListener('touchend', unlockAudio, true);
  document.removeEventListener('click', unlockAudio, true);
  if (cancelPlayback) return;
  const silent = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQIAAACAgA==';
  speechAudio.src = silent;
  speechAudio.muted = true;
  try {
    const result = speechAudio.play();
    const finish = () => {
      if (speechAudio.src === silent && !cancelPlayback) speechAudio.pause();
      speechAudio.muted = false;
    };
    if (result) result.then(finish, finish); else finish();
  } catch (_) { speechAudio.muted = false; }
}
document.addEventListener('touchend', unlockAudio, { capture:true, passive:true });
document.addEventListener('click', unlockAudio, true);

// Fit text inside its existing box. The CSS font size is the upper limit.
// Box sizes and the fixed controls never depend on the fitted text size.
let fitRequest = 0;
function scheduleFit() {
  if (!fitRequest) fitRequest = requestAnimationFrame(() => { fitRequest = 0; fitVisibleText(); });
}
function fitBox(box, content) {
  if (!box.clientWidth || !box.clientHeight || !content) return;
  box.style.removeProperty('font-size');
  const style = getComputedStyle(box);
  const max = parseFloat(style.fontSize);
  const width = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const height = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  const fits = () => content.scrollWidth <= width + .25 && content.getBoundingClientRect().height <= height + .25;
  if (fits()) return;
  let low = 6, high = max;
  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2;
    box.style.fontSize = mid + 'px';
    if (fits()) low = mid; else high = mid;
  }
  box.style.fontSize = Math.floor(low * 10) / 10 + 'px';
}
function fitVisibleText() {
  document.querySelectorAll('.screen.active .item, .screen.active .sentence-item').forEach(box => fitBox(box, box.firstElementChild));
  if (byId('sentencesScreen').classList.contains('active') && byId('sentenceFocus').classList.contains('show')) fitBox(byId('sentenceFocus'), byId('sentenceFocus').firstElementChild);
  if (byId('homeScreen').classList.contains('active')) {
    document.querySelectorAll('.tiles').forEach(tiles => {
      tiles.style.removeProperty('font-size');
      let size = parseFloat(getComputedStyle(tiles).fontSize);
      const tooWide = () => [...tiles.children].some(tile => tile.scrollWidth > tile.clientWidth);
      while (size > 8 && tooWide()) { size -= .5; tiles.style.fontSize = size + 'px'; }
    });
  }
}
window.addEventListener('resize', scheduleFit);
if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleFit);
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(scheduleFit);
  for (const id of ['lettersGrid', 'wordGrid', 'sentenceStage', 'homeScreen']) observer.observe(byId(id));
}
if (document.fonts?.ready) document.fonts.ready.then(scheduleFit);

function setTranslate(kind, enabled) {
  states[kind].translate = enabled;
  const button = byId(ui[kind].prefix + 'Translate');
  button.classList.toggle('on', enabled);
  button.setAttribute('aria-pressed', String(enabled));
}
function stopSearch(kind) {
  Object.assign(states[kind], { search:false, target:null, pending:false });
}
function renderExercise(kind) {
  const state = states[kind];
  const grid = byId(ui[kind].grid);
  grid.replaceChildren();
  state.current.forEach(value => {
    const text = textOf(kind, value);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = kind === 'sentences' ? 'sentence-item' : 'item';
    button.dataset.v = text;
    const content = document.createElement('span');
    content.className = 'item-content';
    const main = document.createElement('span');
    main.className = kind === 'sentences' ? 'sentence-main' : 'word-main';
    main.lang = 'sq';
    main.textContent = kind === 'letters' ? (Math.random() < .5 ? text.toUpperCase() : text) : kind === 'words' && Math.random() < .18 ? text[0].toUpperCase() + text.slice(1) : text;
    content.appendChild(main);
    if (state.translate && kind !== 'letters') {
      const translation = document.createElement('span');
      translation.className = kind === 'sentences' ? 'sentence-translation' : 'word-translation';
      translation.lang = 'nl';
      translation.textContent = kind === 'sentences' ? value.nl : translations[text] || 'vertaling ontbreekt';
      content.appendChild(translation);
    }
    button.appendChild(content);
    button.onclick = () => tapExercise(kind, value, button);
    grid.appendChild(button);
  });
  scheduleFit();
}
function mixExercise(kind) {
  const source = kind === 'letters' ? alphabet : kind === 'words' ? wordData[currentLen] : sentenceData;
  states[kind].current = shuffle(source).slice(0, kind === 'sentences' ? 4 : 12);
  renderExercise(kind);
}
function showScreen(id) {
  beginOperation();
  for (const kind of Object.keys(states)) stopSearch(kind);
  document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.id === id));
  scheduleFit();
}
async function openWords(n) {
  if (!lengths.includes(n)) return;
  showScreen('wordsScreen');
  const run = operationId;
  currentLen = n;
  setTranslate('words', false);
  byId('wordExercise').className = 'exercise len' + n;
  byId('wordTitle').textContent = 'Albanese woorden van ' + n + ' letters';
  mixExercise('words');
  hint('words', ui.words.normal);
  await ensureWordData();
  if (isCurrent(run)) mixExercise('words');
}
function openSentences() {
  showScreen('sentencesScreen');
  setTranslate('sentences', false);
  mixExercise('sentences');
  hint('sentences', ui.sentences.normal);
}
function showSentenceFocus(text, full = false) {
  byId('sentenceStage').classList.add('has-focus');
  const focus = byId('sentenceFocus');
  focus.firstElementChild.textContent = text;
  focus.firstElementChild.lang = 'sq';
  focus.classList.add('show');
  focus.classList.toggle('full', full);
  scheduleFit();
}
function sentenceWord(raw) { return raw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}'’\-]+$/gu, ''); }
async function guidedSentence(text, run) {
  const words = text.split(/\s+/).map(sentenceWord).filter(Boolean);
  hint('sentences', 'Lees mee: woord voor woord.');
  for (const word of words) {
    if (!isCurrent(run)) return false;
    showSentenceFocus(word);
    if (!(await pauseFor(950, run)) || !(await playMapped(word, run, 'sentences')) || !(await pauseFor(140, run))) return false;
  }
  hint('sentences', 'Nu nog een keer wat sneller.');
  for (const word of words) {
    if (!isCurrent(run)) return false;
    showSentenceFocus(word);
    if (!(await pauseFor(120, run)) || !(await playMapped(word, run, 'sentences')) || !(await pauseFor(60, run))) return false;
  }
  if (!isCurrent(run)) return false;
  showSentenceFocus(text, true);
  hint('sentences', 'Nu de hele zin.');
  if (!(await pauseFor(350, run))) return false;
  const ok = await playMapped(text, run, 'sentences');
  // Keep the full sentence and the 2:1:1:1:1 layout for further reading.
  if (ok && isCurrent(run)) hint('sentences', ui.sentences.normal);
  return ok;
}
async function tapExercise(kind, value, button) {
  const state = states[kind];
  const text = textOf(kind, value);
  if (state.search) {
    if (state.pending) return;
    const correct = text === state.target;
    const run = beginOperation();
    button.classList.add(correct ? 'correct' : 'wrong');
    playSound(correct ? 'goodSound' : 'badSound');
    state.pending = correct;
    if (!(await pauseFor(correct ? 360 : 420, run))) return;
    if (correct && state.search) await offerTarget(kind);
    else button.classList.remove('wrong');
    return;
  }
  const run = beginOperation();
  button.classList.add('active');
  if (kind === 'sentences') await guidedSentence(text, run);
  else if (kind === 'words' && state.translate) {
    hint(kind, text + ' = ' + (translations[text] || 'vertaling niet beschikbaar'));
    await playMapped(text, run, kind);
  } else {
    if (await pauseFor(70, run)) {
      for (let i = 0; i < 3; i++) {
        if (!isCurrent(run) || !(await playMapped(text, run, kind))) break;
        if (i < 2 && !(await pauseFor(230, run))) break;
      }
    }
  }
  if (isCurrent(run)) button.classList.remove('active');
}
async function offerTarget(kind, repeat = false) {
  const state = states[kind];
  const run = beginOperation();
  if (!repeat || !state.target) {
    const choices = state.current.map(value => textOf(kind, value)).filter(text => text !== state.last);
    state.target = choices[Math.floor(Math.random() * choices.length)] || textOf(kind, state.current[0]);
    state.last = state.target;
  }
  state.search = true;
  hint(kind, repeat ? 'Luister nog eens en zoek hetzelfde antwoord.' : 'Luister en tik ' + ui[kind].article + ' ' + ui[kind].noun + '.');
  const target = state.target;
  if (await pauseFor(70, run)) await playMapped(target, run, kind);
}
async function playExample(kind) {
  const run = beginOperation();
  stopSearch(kind);
  if (kind !== 'letters') { setTranslate(kind, false); renderExercise(kind); }
  hint(kind, 'Voorbeeld speelt af…');
  const current = [...states[kind].current];
  for (const value of current) {
    if (!isCurrent(run)) return;
    const text = textOf(kind, value);
    const button = [...byId(ui[kind].grid).children].find(element => element.dataset.v === text);
    if (button) button.classList.add('active');
    const ok = await playMapped(text, run, kind);
    if (!isCurrent(run)) return;
    if (button) button.classList.remove('active');
    if (!ok || !(await pauseFor(kind === 'words' ? 100 : 120, run))) return;
  }
  if (isCurrent(run)) hint(kind, ui[kind].normal);
}
for (const kind of Object.keys(states)) {
  const prefix = ui[kind].prefix;
  byId(prefix + 'Play').onclick = () => playExample(kind);
  byId(prefix + 'Stop').onclick = () => { beginOperation(); stopSearch(kind); hint(kind, 'Gestopt.'); };
  byId(prefix + 'Mix').onclick = () => {
    beginOperation(); stopSearch(kind); mixExercise(kind);
    hint(kind, states[kind].translate ? 'Vertalen staat aan: tik op een ' + ui[kind].noun + '.' : ui[kind].normal);
  };
  byId(prefix + 'Search').onclick = () => {
    const repeat = states[kind].search && !!states[kind].target;
    if (!repeat) states[kind].last = null;
    if (kind !== 'letters' && states[kind].translate) { setTranslate(kind, false); renderExercise(kind); }
    return offerTarget(kind, repeat);
  };
  if (kind !== 'letters') byId(prefix + 'Translate').onclick = () => {
    beginOperation(); stopSearch(kind); setTranslate(kind, !states[kind].translate); renderExercise(kind);
    hint(kind, states[kind].translate ? 'Vertalen staat aan: Nederlandse vertalingen staan onder de ' + (kind === 'words' ? 'woorden.' : 'zinnen.') : ui[kind].normal);
  };
}
const voiceSelect = byId('neuralVoice');
voiceSelect.value = neuralVoice;
voiceSelect.onchange = () => {
  beginOperation(); neuralVoice = voiceSelect.value;
  try { localStorage.setItem('albanianNeuralVoiceV1', neuralVoice); } catch (_) {}
};
byId('voiceTest').onclick = () => playMapped('Përshëndetje!', beginOperation(), null);
mixExercise('letters');
ensureWordData();
ensureAudioMap();
scheduleFit();

// Updates are installed in the background, but activated only after consent.
// Opening/focusing the app and a visible-page interval also check long-lived PWAs.
if ('serviceWorker' in navigator && window.isSecureContext && /^https?:$/.test(location.protocol)) {
  let registration = null;
  let updateRequested = false;
  let refreshing = false;
  let hadController = !!navigator.serviceWorker.controller;
  function showUpdate(worker) {
    byId('updateBox').style.display = 'flex';
    byId('updateBtn').disabled = false;
    byId('updateBtn').onclick = () => {
      const waiting = registration?.waiting || worker;
      if (!waiting || waiting.state === 'redundant') { checkUpdate(); return; }
      beginOperation();
      updateRequested = true;
      byId('updateBtn').disabled = true;
      waiting.postMessage({ type:'SKIP_WAITING' });
    };
  }
  let checking = false;
  async function checkUpdate() {
    if (!registration || checking || document.visibilityState === 'hidden') return;
    checking = true;
    try {
      await registration.update();
      if (registration.waiting) showUpdate(registration.waiting);
    } catch (_) { /* An offline check must not interrupt an exercise. */ }
    finally { checking = false; }
  }
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing && (hadController || updateRequested)) {
      refreshing = true; beginOperation(); location.reload();
    }
    hadController = true;
  });
  async function registerWorker() {
    const target = new URL('./service-worker.js', document.baseURI);
    const scope = new URL('./', document.baseURI).href;
    const previous = await navigator.serviceWorker.getRegistration(scope);
    const previousScript = previous?.active?.scriptURL || previous?.waiting?.scriptURL || previous?.installing?.scriptURL;
    // Retain an existing query string during migration. Changing only the worker
    // URL otherwise installs the same release twice and offers a duplicate update.
    const oldURL = previousScript ? new URL(previousScript) : null;
    const sameWorker = previous?.scope === scope && oldURL?.origin === target.origin && oldURL?.pathname === target.pathname;
    return navigator.serviceWorker.register(sameWorker ? previousScript : target.href, { scope, updateViaCache:'none' });
  }
  registerWorker().then(reg => {
    registration = reg;
    if (reg.waiting) showUpdate(reg.waiting);
    const watch = worker => {
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg.waiting || worker);
      });
    };
    watch(reg.installing);
    reg.addEventListener('updatefound', () => watch(reg.installing));
    checkUpdate();
  }).catch(error => console.warn('Offline-installatie niet beschikbaar:', error));
  window.addEventListener('online', checkUpdate);
  window.addEventListener('focus', checkUpdate);
  document.addEventListener('visibilitychange', checkUpdate);
  setInterval(checkUpdate, 60000);
}
