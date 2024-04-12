import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { extractToken } from '../../lib/api/extractToken';

export const load = async ({ request }: any) => {
  
  const token = request.headers.get('cookie')
  let res;
  
  if (token) {

    let tokenFormated = '';
    tokenFormated = extractToken(token);
    
    try {
      res = await verifyToken({token: tokenFormated});
      //console.log(res);
    } catch (error) {
      console.log(error);
    }

    if (res) {
      if (res.status === 200) {
        return redirect(302, "/");
      }
    }
  }
}