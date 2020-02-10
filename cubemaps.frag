#version 330 core
out vec4 FragColor;

in vec3 Normal;
in vec3 Position;

uniform float problem;

uniform vec3 cameraPos;
uniform samplerCube skybox;

void main()
{
    if(problem == 1.0) {
        //reflection
        vec3 I = normalize(Position - cameraPos);
        vec3 R = reflect(I, normalize(Normal));
        FragColor = vec4(texture(skybox, R).rgb, 1.0);
    }
    else if (problem == 2.0) {
        //refraction
        float ratio = 0.99 ;
        vec3 I = normalize(Position - cameraPos);
        vec3 R = refract(I, normalize(Normal), ratio);
        FragColor = vec4(texture(skybox, R).rgb, 1.0);
    }
    else if (problem == 3.0) {
        //fresnel
        float FresnelPower = 2.0;
        float ratio = 0.99;
        vec3 I = normalize(Position - cameraPos);
        vec3 N = normalize(Normal);
        vec3 Refract = refract(I, N, ratio);
        vec3 Reflect = reflect(I, N);
        vec3 refl = texture(skybox,Reflect).rgb;
        vec3 refr = texture(skybox,Refract).rgb;
        // Schlick approximation
        float f = ((1.0-ratio)*(1.0-ratio))/((1.0+ratio)*(1.0+ratio));
        float schlick = f+(1-f)*pow(1-dot(-I,N),FresnelPower);
        FragColor = vec4 (mix(refr,refl,0.4),1);
    }
    else if (problem == 4.0) {
        //chromatic
        float FresnelPower = 5.0;
        float EtaR = 0.95;
        float EtaG = 0.97; // Ratio of indices of refraction
        float EtaB = 0.99;
        float CromaticF = ((1.0-EtaG) * (1.0-EtaG)) / ((1.0+EtaG) * (1.0+EtaG));
        float ratio = 0.9;
        vec3 I = normalize(Position - cameraPos);
        vec3 N = normalize(Normal);
        float ChromaticRatio = CromaticF + (1.0 - CromaticF) * pow((1.0 - dot(-I, N)), FresnelPower);
        vec3 Refract = refract(I, N, ratio);
        vec3 Reflect = reflect(I, N);
        vec3 RefractR = refract(I, N, EtaR);
        vec3 RefractG = refract(I, N, EtaG);
        vec3 RefractB = refract(I, N, EtaB);
        vec3 refractColor, reflectColor;
        refractColor.r = vec3(texture(skybox, RefractR)).r;
        refractColor.g = vec3(texture(skybox, RefractG)).g;
        refractColor.b = vec3(texture(skybox, RefractB)).b;
        reflectColor = vec3(texture(skybox, Reflect));
        vec3 color = mix(refractColor, reflectColor, ChromaticRatio);
        FragColor = vec4(color, 1.0);
    }
    
}