import CheckboxInput from '@/components/form/checkbox-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import { store } from '@/wayfinder/routes/login';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
}

export default function Login({status}: LoginProps) {
    return (
        <div className="authincation vh-100">
            <Head title="Log in" />
            <div className="container vh-100">
                <div className="row justify-content-center vh-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <img className="img-fluid" src="/images/logo-full.png" alt="" />
                                        <h4 className="text-center my-4">
                                            Sign in your account
                                        </h4>

                                        {status && (
                                            <div className="alert alert-success text-center mb-4">
                                                {status}
                                            </div>
                                        )}

                                        <Form
                                            {...store.form()}
                                            resetOnSuccess={['password']}
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        label="Email"
                                                        error={errors.email}
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="hello@example.com"
                                                    />

                                                    <TextInput
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        label="Password"
                                                        error={errors.password}
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="Password"
                                                    />

                                                    <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                        <CheckboxInput
                                                            id="remember"
                                                            name="remember"
                                                            label="Remember me"
                                                            error={errors.remember}
                                                            tabIndex={3}
                                                        />
                                                    </div>

                                                    <div className="text-center">
                                                        <SubmitButton
                                                            processing={processing}
                                                            tabIndex={4}
                                                        >
                                                            Sign me in
                                                        </SubmitButton>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
