function app(){
  const name= "Birds";
  let num1=19;
  let num2=31;
  let num = num1+num2;
  let age =18;
  let userage=20;
  const warn = () => {
    alert("Warning⚠️")
  };
  return (
    <>
   
 <h1 style={{color:"orange"}}>page for {name}</h1>
 <div style={{diplay:"flex"}} >
 <img style={{width:500}}
  src="https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3NodXR0ZXJzdG9jay0yMzgyMTczMjE3LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fX19" alt="bird" />
 <p className="Avian" >ds are a group of warm-blooded vertebrate animals constituting the class Aves, characterised by feathers,
   toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton. Birds live worldwide and range in size from the 5.5 cm (2.2 in) bee hummingbird to the 2.8 m (9 ft 2 in) common ostrich.
   There are over 11,000 living species and they are split into 44 orders.
   More than half are passerine or "perching" birds. Birds have wings whose development varies according to species;
    the only known groups without wings are the extinct moa and elephant birds. 
    Wings, which are modified forelimbs, gave birds the ability to <b>num fly</b>, although further evolution has led to the loss of flight in some birds, including ratites, penguins, and diverse endemic island species. The digestive and respiratory systems of birds are also uniquely adapted for flight. 
    Some bird species of aquatic environments, particularly seabirds and some waterbirds, have further evolved for swimming.
     The study of birds is called ornithology.
    Birds evolved from earlier theropods, and thus constitute the only known living dinosaurs.
     Whilst traditional Linnaean taxonomy placed birds in their own class 
     (owing to their unique morphology and being the only group of animals other than mammals where all its species are warm-blooded), 
     birds are considered reptiles in the modern cladistic sense of the term.
      Their closest living relatives are the crocodilians, both forming a clade known as archosaurs. 
      Birds are descendants of t</p>
     </div>
      {
      (userage>age)?<p>user Logged IN</p>:
      <p>Invalid User</p>
    }
    <button onDoubleClick={()=>{
      alert("Warning⚠️")
    }} style={{width:"fit-content"}}>Danger</button>
    </> 
);
}
export default app;