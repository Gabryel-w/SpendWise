require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Rodando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const supabase = require("./supabase");

app.get("/users", async (req, res) => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
});

app.post("/users", async (req, res) => {

    const { email, name } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ email, name }])
        .select();

    if (error) {
        return res.status(400).json(error)
    }

    res.status(201).json(data);
})

app.post("/transactions", async (req, res) => {
    const { user_id,description,type, amount, category, date } = req.body

    const { data, error } = await supabase
        .from("transactions")
        .insert([{ user_id, description, type, amount, category, date }])
        .select();

    if (error) {
        res.status(400).json(error);
    }

    res.status(201).json(data)
})

app.get("/transactions", async (req, res) => {
    const { data, error } = await supabase.from("transactions").select("*");

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
});

app.put("/transactions/:id", async (req, res) => {
    const { id } = req.params;
    const { type, amount, category, date } = req.body;

    const { data, error } = await supabase
        .from("transactions")
        .update({ type, amount, category, date })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
});

app.delete("/transactions/:id", async(req, res) => {
    const {id} = req.params;

    const {error} = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
        return res.status(400).json(error);
    }

    res.json({message: "Transação removida com sucesso."});
});