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
    async login({ request, response, auth }) {
        const { email, password } = request.all()

        try {
            await auth.check();
        } catch (error) {
            try {
                await auth.attempt(email, password)
            } catch (error) {
                return response.json({ success: 0, errorMessage: 'Bad credentials' });
            }
        }

        return response.json({ success: 1, user : auth.user.prepared() });
    }

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
    async register ({ request, response, auth }) {
        const { email, password } = request.all()
        let isAuth
        let user

        try {
            isAuth = await auth.check()
        } catch (error) {
            console.log(error)
        }

        if ( isAuth ) {
            user = {
                id   : auth.user.id,
                name : auth.user.email,
            }

            return response.json({ success: 1, user })
        }

        user          = new User()
        user.email    = email
        user.password = password

        let _error;

        try {
            await user.save()
        } catch (error) {
            _error = error;
        }

        if ( _error && _error.constraint === 'users_email_unique' ) {
            try {
                await auth.attempt(email, password)
            } catch (error) {
                return response.json({
                    success      : 0,
                    errorMessage : 'Account already exist. Please login'
                })
            }

            return response.json({
                success : 1,
                user    : auth.user.prepared(),
                message : 'Account already exist'
            })
        }
        else if (_error) {
            return response.json({
                success      : 0,
                errorMessage : 'Bad login or password'
            })
        }

        return response.json({
            success : 1,
            user    : auth.user.prepared(),
            message : 'Registration Successful!'
        })
    }

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

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update ({ params, request, response }) {
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
