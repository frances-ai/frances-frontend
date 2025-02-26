import {Link} from "@mui/material";


function FrancesLogo(props) {
    return <Link style={{textDecoration: "none", fontSize: props.size, fontWeight: props.weight}}  href="/">
        <span style={{color:"#02A7F0"}}>f</span>
        <span style={{color:"#D9001B"}}>r</span>
        <span style={{color:"#F59A23"}}>a</span>
        <span style={{color:"#02A7F0"}}>n</span>
        <span style={{color:"#63A103"}}>c</span>
        <span style={{color:"#D9001B"}}>e</span>
        <span style={{color:"#D9001B"}}>s</span>
    </Link>
}

export default FrancesLogo