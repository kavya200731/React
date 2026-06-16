import App from "./App.jsx"
import { useState } from "react";
function Hello()
{
    return(
        <p style={{textAlign:"left"}}>Hello</p>
    )   
}
function Galaxy(props){
    return(
<div style={{textAlign:"left"}}>
   <h4> {props.name}</h4>
    <h4>process:{props.process}</h4>
    </div>
    );
}
function Star(){
    return(
 <Galaxy name="Sun"
    process="Nuclear Fission and Fusion">
 </Galaxy>
    );
}
function Summary(){
    return(
     <p style={{textAlign:"justify"}}>Motivated and detail-oriented Computer Science student with a strong foundation in web development, programming, and problem-solving. Skilled in HTML, CSS, JavaScript, Java, React.js, and database management. Passionate about building user-friendly applications and learning emerging technologies. Strong teamwork, communication, and analytical skills with a commitment to delivering high-quality solutions. Seeking an opportunity to apply technical knowledge and gain hands-on experience in a challenging technology-focused role.</p>
    );
}
function Profile(){
    return(
        <summary>
            job="Animator"
            company="Garena"
            skill1="unreal Engine"
            skill2="blender"
            skill3="Graphic Design"
        </summary>
    )
}
function Animal() {

    const [showBirds, setShowBirds] = useState(false);

    return(
        <>
        <h1>Animal</h1>
        <div style={{display:"flex",gap:"20px"}}>
        <p
        style={{textAlign:"justify"}}
        >
            Animals are multicellular, eukaryotic organisms belonging to the biological kingdom Animalia (/ˌænɪˈmeɪliə/[4]). With few exceptions, animals consume organic material, breathe oxygen, have myocytes and are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development. Animals form a clade, meaning that they arose from a single common ancestor. Over 1.5 million living animal species have been described, of which around 1.05 million are insects, over 85,000 are molluscs, and around 65,000 are vertebrates. It has been estimated there are as many as 7.77 million animal species on Earth. Animal body lengths range from 8.5 μm (0.00033 in) to 33.6 m (110 ft). They have complex ecologies and interactions with each other and their environments, forming intricate food webs. The scientific study of animals is known as zoology, and the study of animal behaviour is known as ethology.
        </p>

        <img 
        style={{width:100}}
        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500.jpg"
        ></img>
        </div>
        <Hello></Hello>
        <Star></Star>
        <Summary></Summary>
        <Profile></Profile>
        <button 
        style={{ width:"fit-content" }} 
        onClick={() => setShowBirds(true)}
        >
            Birds
        </button>

        {showBirds && <App />}

        </>
    );
}

export default Animal;