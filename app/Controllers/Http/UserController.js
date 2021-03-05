'use strict'

const Database = use('Database')
const User = use('App/Models/User')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
    async register({ request, auth, response }) {
        let user = await User.create(request.all())

        //generate token for user;
        let token = await auth.generate(user)

        Object.assign(user, token)

        return response.json({ success: 1, user: user.prepared(), message : 'Registration Successful!' })
    }

    async login({request, auth, response}) {
        let {email, password} = request.all();

        try {
            if (await auth.attempt(email, password)) {
            let user = await User.findBy('email', email)
            let token = await auth.generate(user)

            Object.assign(user, token)
            return response.json({ success: 1, user: user.prepared() })
            }
        }
        catch (e) {
            return response.json({ success: 0, errorMessage: 'You are not registered!' })
        }
    }

    // async login({ request, response, auth }) {
    //     const { email, password } = request.all()
    //     let token;
    //     let user;

    //     try {
    //         token = await auth.attempt(email, password)
    //         // user  = await auth.getUser( token )
    //         console.log('auth', auth);

    //     } catch (error) {
    //         console.log('error', error);

    //         return response.json({ success: 0, errorMessage: 'Wrong login or password', error });
    //     }

    //     // try {
    //     //     await auth.check();
    //     // } catch (error) {
    //     //     try {
    //     //         await auth.attempt(email, password)
    //     //     } catch (error) {
    //     //         return response.json({ success: 0, errorMessage: 'Bad credentials' });
    //     //     }
    //     // }

    //     return response.json({ ...token, success: 1, user });

    //     // return response.json({ success: 1, user : auth.user.prepared() });
    // }

    async logout({request, response, auth}) {
        try {
            await auth.logout()
        }
        catch(error) {
            return response.json({ success: 0 });
        }

        return response.json({ success: 1 });
    }


  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
    // async register ({ request, response, auth }) {
    //     const { email, password } = request.all()
    //     let isAuth
    //     let user

    //     try {
    //         isAuth = await auth.check()
    //     } catch (error) {
    //         console.log(error)
    //     }

    //     if ( isAuth ) {
    //         user = {
    //             id   : auth.user.id,
    //             name : auth.user.email,
    //         }

    //         return response.json({ success: 1, user })
    //     }

    //     user          = new User()
    //     user.email    = email
    //     user.password = password

    //     let _error;

    //     try {
    //         await user.save()
    //     } catch (error) {
    //         _error = error;
    //     }

    //     if ( _error && _error.constraint === 'users_email_unique' ) {
    //         try {
    //             await auth.attempt(email, password)
    //         } catch (error) {
    //             return response.json({
    //                 success      : 0,
    //                 errorMessage : 'Account already exist. Please login'
    //             })
    //         }

    //         return response.json({
    //             success : 1,
    //             user    : auth.user.prepared(),
    //             message : 'Account already exist'
    //         })
    //     }
    //     else if (_error) {
    //         console.log('_error', _error);

    //         return response.json({
    //             success      : 0,
    //             errorMessage : 'Bad login or password'
    //         })
    //     }

    //     return response.json({
    //         success : 1,
    //         user    : auth.user.prepared(),
    //         message : 'Registration Successful!'
    //     })
    // }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    show ({ auth, params }) {
        if (auth.user.id !== Number(params.id)) {
        return 'You cannot see someone else\'s profile'
        }

        return auth.user
    }

    async check({ request, response, auth }) {
        try {
            await auth.check()
        } catch (error) {
            return response.json({ success: 0 })
        }

        return response.json({
            success : 1,
            user    : auth.user.prepared()
        })
    }
}

module.exports = UserController
