import { prisma } from "@/lib/prisma";
import { schema } from "@/lib/shema";

const signUp = async (formData: FormData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await prisma.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
   
}

export { signUp };