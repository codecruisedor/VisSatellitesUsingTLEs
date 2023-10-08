uniform sampler2D globeTexture;
varying vec2 vertexUV; //x,y cooridnates of mesh
varying vec3 vertexNormal;


void main() {
    float intesity = 1.1 - dot(vertexNormal, vec3(0.0,0.0,1.0));
    vec3 atmosphere = vec3(0.3,0.6,1.0) * pow(intesity,1.5); 
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz,1.0);
}