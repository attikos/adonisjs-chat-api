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
    async register({request, auth, response}) {
        let {email, password, passwordConfirm} = request.all();
        let user

        if (!email) {
            return response.json({
                errorMessage : 'Email required'
            })
        }

        if (!password) {
            return response.json({
                errorMessage : 'Password required'
            })
        }

        if (password !== passwordConfirm || !passwordConfirm) {
            return response.json({
                errorMessage : 'Please confirm your password'
            })
        }

        try {
            user = await User.create({email, password})
        }
        catch (error) {
            console.log('error', error);

            return response.json({
                errorMessage : 'Account already exist'
            })
        }

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

    async logout({request, response, auth}) {
        const apiToken = auth.getAuthHeader()

        await auth
            .authenticator('api')
            .revokeTokens([apiToken])

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
