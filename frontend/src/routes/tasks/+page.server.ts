import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { getTasks } from '$lib/api/task.js';
import { extractToken } from '$lib/api/extractToken';

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {
      
      const tokenFormated = extractToken(token);

      const res = await verifyToken({token: tokenFormated});
      //console.log(res);

      const resTasks = await getTasks(tokenFormated);

      return {
        tasks: resTasks.data,
        token: tokenFormated
      }
    } catch (error) {
      //console.log(error);
      console.log("Error con el token o no encontrado en el tasks(/)");
      return redirect(302, "/login");
    }
  } else {
    return redirect(302, "/login");
  }
}