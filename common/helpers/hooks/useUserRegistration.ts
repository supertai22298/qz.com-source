import useUserApi from './useUserApi';
import { generateRandomPassword } from 'helpers/user';

interface RegisterUserArgs {
	captchaToken: any,
	contentIds?: Array<number>,
	email: string,
	password?: string,
	source: string,
	useCaptcha?: boolean,
}

/**
 * For maximum creative potential, registerUser is left uncaught & can throw!
 * When you use it, provide your own .catch and/or save your own error state.
 */
function useUserRegistration(): { registerUser: ( args: RegisterUserArgs ) => Promise<any>, loading: boolean } {
	const { loading, callApi } = useUserApi();

	function registerUser( args: RegisterUserArgs ) {
		// awkward, but useCaptcha should default to true
		const useCaptcha = args.useCaptcha === undefined ? true : args.useCaptcha;
		const initialPassword = args.password || generateRandomPassword();
		const body = {
			captchaToken: args.captchaToken,
			contentIds: args.contentIds || [],
			email: args.email,
			hasRandomPassword: !args.password,
			password: initialPassword,
			source: args.source,
			useCaptcha,
		};

		return callApi( {
			endpoint: '',
			method: 'post',
			body,
		} );
	}

	return { registerUser, loading };
}

export default useUserRegistration;
