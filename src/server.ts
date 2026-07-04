import dotenv from "dotenv"
import express, {type Application, type Request, type Response} from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import { fromNodeHeaders, toNodeHandler } from "better-auth/node"
import { auth } from "../lib/auth"
import { activities, categoryRoute } from "./routes/route"


dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials:true
    }),
)
app.use(
        helmet({
        crossOriginOpenerPolicy : {policy: "same-origin"}
    })
)

//better-auth
app.all("/api/auth/*splat", toNodeHandler(auth));

//parsing
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
}

//routes 
app.use("/api/category", categoryRoute)
app.use("/api/activities_log", activities)


//test route
app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

//global error
app.use((err:Error, req: Request, res:Response)=>{
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong"})
})

//server running
app.listen(PORT, ()=>{
    console.log(`Server is Running on Port ${PORT}`)
})

