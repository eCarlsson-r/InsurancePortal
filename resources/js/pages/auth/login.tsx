import CheckboxInput from '@/components/form/checkbox-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import { store } from '@/wayfinder/routes/login';
import { Form, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
    status?: string;
}

export default function Login({status}: LoginProps) {
    const { t } = useTranslation();

    return (
        <div className="authincation vh-100">
            <Head title={t('auth.login_title')} />
            <div className="container vh-100">
                <div className="row justify-content-center vh-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <img className="img-fluid" src="/images/logo-full.png" alt="" />
                                        <h4 className="text-center my-4">
                                            {t('auth.sign_in_prompt')}
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
                                                        label={t('auth.email')}
                                                        error={errors.email}
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder={t('auth.email_placeholder')}
                                                    />

                                                    <TextInput
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        label={t('auth.password')}
                                                        error={errors.password}
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder={t('auth.password_placeholder')}
                                                    />

                                                    <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                        <CheckboxInput
                                                            id="remember"
                                                            name="remember"
                                                            label={t('auth.remember_me')}
                                                            error={errors.remember}
                                                            tabIndex={3}
                                                        />
                                                    </div>

                                                    <div className="text-center">
                                                        <SubmitButton
                                                            processing={processing}
                                                            tabIndex={4}
                                                        >
                                                            {t('auth.sign_in')}
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
