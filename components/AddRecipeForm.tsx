"use client";
import React from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from './ui/input';
import { Button } from './ui/button';


const formSchema = z.object({
  recipeName: z.string().min(1, "Recipe name is required"),
  steps: z.array(
    z.object({
      description: z.string().min(1, "Step description is required"),
    })
  ).nonempty({ message: "At least one step is required" }),
  recipeDescription: z.string().max(1000),
});

const RecipeForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: "",
      steps: [{ description: "" }],
      recipeDescription: "",
    },
  });

  const { control, handleSubmit, register, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted Data:", values);
  }



  return (
    <div className='flex w-full justify-center'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[900px]">
          <FormField
            control={control}
            name="recipeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg font-semibold'>Numele rețetei</FormLabel>
                <FormControl>
                  <Input placeholder="Introdu numele rețetei" {...field} />
                </FormControl>
                {/* {errors.recipeName && <p className="text-red-500">{errors.recipeName.message}</p>} */}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="recipeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg font-semibold'>Descriere</FormLabel>
                <FormControl>
                  <Input placeholder="Fă o scurtă descriere rețetei" {...field} />
                </FormControl>
                {/* {errors.recipeName && <p className="text-red-500">{errors.recipeName.message}</p>} */}
              </FormItem>
            )}
          />

          <div className='space-y-4'>
            <h2 className="text-lg font-semibold">Pași de preparare</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <FormField
                  control={control}
                  name={`steps.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Pas {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrie pasul de pregătire" {...field} />
                      </FormControl>  
                      {/* {errors.steps?.[index]?.description && (
                        <p className="text-red-500">{errors.steps[index]?.description.message}</p>
                      )} */}
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={() => remove(index)} variant="outline" className="self-end bg-red-600 text-white">
                  <span className="material-symbols-outlined">delete</span>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ description: "" })}
              className="mt-2"
            >
              Add Step
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Submit Recipe
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RecipeForm;
