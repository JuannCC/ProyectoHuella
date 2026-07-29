import { supabase } from "../lib/supabase";

export async function getAnimals() {
  const { data, error } = await supabase
    .from("animals")
    .select("*");

  if (error) throw error;

  return data || [];
}

export async function createAnimal(animal) {
  const { error } = await supabase
    .from("animals")
    .insert(animal);

  if (error) throw error;
}

export async function updateAnimal(id, animal) {
  const { error } = await supabase
    .from("animals")
    .update(animal)
    .eq("id", id);

  if (error) throw error;
}