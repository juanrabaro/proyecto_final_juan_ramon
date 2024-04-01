import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';

export const load = async ({ request }: any) => {
  
  const token = request.headers.get('cookie')
  let res;

  if (token) {
    const tokenFormated = token.replace('token=', '');

    try {
      res = await verifyToken(tokenFormated);
      console.log(res);

    } catch (error) {
      console.log(error);
    }

    if (res) {
      return redirect(302, "/");
    }
  }
}